import { supabase } from '@/integrations/supabase/client';
import { ReviewsService } from './reviewsService';
import { encryptData, sanitizeText } from '@/lib/security';
import { sanitizeErrorMessage, logSecurityEvent } from '@/lib/errorHandling';

/**
 * Service for handling platform integrations
 */
export class IntegrationService {
  /**
   * Google Places API integration
   */
  static async fetchGoogleReviews(placeId: string): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      // Call Supabase Edge Function (uses server-side secret)
      const { data, error } = await supabase.functions.invoke('fetch-google-reviews', {
        body: { placeId }
      });

      if (error) {
        throw new Error(error.message);
      }

      const reviews = data?.reviews || [];
      let successCount = 0;

      // Save each review to the database
      for (const review of reviews) {
        const reviewData = {
          platform: 'google',
          guest_name: review.author_name || 'Anonymous',
          date: review.time ? new Date(review.time * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          rating: review.rating || 5,
          review_text: review.text || '',
        };

        const result = await ReviewsService.createReview(reviewData);
        if (result.data && !result.error) {
          successCount++;
        }
      }

      return { success: true, count: successCount };
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Parse and import CSV reviews
   */
  static async importCsvReviews(csvFile: File, platform: string): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers: guest_name, date, rating, review_text
      const requiredHeaders = ['guest_name', 'date', 'rating', 'review_text'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        return {
          success: false,
          error: `Missing required columns: ${missingHeaders.join(', ')}`
        };
      }

      let successCount = 0;
      
      // Process each row (skip header)
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        
        if (values.length !== headers.length) {
          continue; // Skip malformed rows
        }

        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });

        const reviewData = {
          platform: platform.toLowerCase(),
          guest_name: rowData.guest_name || 'Anonymous',
          date: rowData.date || new Date().toISOString().split('T')[0],
          rating: parseInt(rowData.rating) || 5,
          review_text: rowData.review_text || '',
        };

        const result = await ReviewsService.createReview(reviewData);
        if (result.data && !result.error) {
          successCount++;
        }
      }

      return { success: true, count: successCount };
    } catch (error) {
      console.error('Error importing CSV:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to parse CSV file' 
      };
    }
  }

  /**
   * Store API credentials securely
   */
  static async storeApiCredentials(platform: string, credentials: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logSecurityEvent('unauthorized_credential_storage_attempt', { platform });
        return { success: false, error: 'User not authenticated' };
      }

      // Sanitize platform name
      const sanitizedPlatform = sanitizeText(platform);
      if (!sanitizedPlatform) {
        return { success: false, error: 'Invalid platform name' };
      }

      // Encrypt sensitive credentials
      const encryptedCredentials: Record<string, string> = {};
      for (const [key, value] of Object.entries(credentials)) {
        if (typeof value === 'string' && value.length > 0) {
          encryptedCredentials[sanitizeText(key)] = await encryptData(value);
        }
      }

      if (Object.keys(encryptedCredentials).length === 0) {
        return { success: false, error: 'No valid credentials provided' };
      }

      // Store credentials in user_integrations table
      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: user.id,
          platform: sanitizedPlatform,
          credentials: encryptedCredentials,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      logSecurityEvent('credentials_stored', { platform: sanitizedPlatform, userId: user.id });
      return { success: true };
    } catch (error) {
      console.error('Error storing credentials:', error);
      const sanitizedMessage = sanitizeErrorMessage(error);
      return { 
        success: false, 
        error: sanitizedMessage
      };
    }
  }
}

/**
 * Types for integration data
 */
export interface GoogleReviewData {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

export interface CsvReviewRow {
  guest_name: string;
  date: string;
  rating: string;
  review_text: string;
}
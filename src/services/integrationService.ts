import { supabase } from '@/integrations/supabase/client';
import { ReviewsService } from './reviewsService';

/**
 * Service for handling platform integrations
 */
export class IntegrationService {
  /**
   * Google Places API integration
   */
  static async fetchGoogleReviews(apiKey: string, placeId: string): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      // Call Supabase Edge Function to securely fetch Google reviews
      const { data, error } = await supabase.functions.invoke('fetch-google-reviews', {
        body: { apiKey, placeId }
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
        if (result.success) {
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
        if (result.success) {
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
        return { success: false, error: 'User not authenticated' };
      }

      // Store encrypted credentials in user settings or dedicated table
      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: user.id,
          platform,
          credentials: credentials, // This should be encrypted in production
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error storing credentials:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to store credentials' 
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
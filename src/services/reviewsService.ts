import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Review = Tables<'reviews'>;
export type ReviewInsert = TablesInsert<'reviews'>;
export type ReviewUpdate = TablesUpdate<'reviews'>;
export type Platform = Tables<'platforms'>;

/**
 * Service class for managing reviews in Supabase
 */
export class ReviewsService {
  /**
   * Fetch all reviews for the current authenticated user
   */
  static async getUserReviews(): Promise<{ data: Review[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: null, error };
    }
  }

  /**
   * Fetch a single review by ID
   */
  static async getReviewById(id: string): Promise<{ data: Review | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching review:', error);
      return { data: null, error };
    }
  }

  /**
   * Create a new review
   */
  static async createReview(review: Omit<ReviewInsert, 'user_id'>): Promise<{ data: Review | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
  }

  /**
   * Update a review with a reply
   */
  static async updateReviewReply(id: string, replyText: string): Promise<{ data: Review | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          reply_text: replyText,
          replied: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating review reply:', error);
      return { data: null, error };
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting review:', error);
      return { error };
    }
  }

  /**
   * Get analytics data for dashboard
   */
  static async getAnalytics(): Promise<{
    data: {
      totalReviews: number;
      averageRating: number;
      pendingReplies: number;
      platformDistribution: Record<string, number>;
      recentReviews: Review[];
    } | null;
    error: any;
  }> {
    try {
      const { data: reviews, error } = await this.getUserReviews();
      if (error || !reviews) throw error;

      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      const pendingReplies = reviews.filter(review => !review.replied).length;
      
      // Calculate platform distribution
      const platformDistribution = reviews.reduce((acc, review) => {
        acc[review.platform] = (acc[review.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get recent reviews (last 5)
      const recentReviews = reviews.slice(0, 5);

      return {
        data: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          pendingReplies,
          platformDistribution,
          recentReviews,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all available platforms
   */
  static async getPlatforms(): Promise<{ data: Platform[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return { data: null, error };
    }
  }

  /**
   * Insert dummy data for new users (for testing purposes)
   */
  static async insertDummyData(): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already has reviews
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('id')
        .limit(1);

      if (existingReviews && existingReviews.length > 0) {
        return { error: null }; // User already has data
      }

      // Call the dummy data function
      const { error } = await supabase.rpc('insert_dummy_reviews', {
        _user_id: user.id,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error inserting dummy data:', error);
      return { error };
    }
  }
}

/**
 * Real-time subscription hook for reviews
 */
export const subscribeToReviews = (
  userId: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel('reviews_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
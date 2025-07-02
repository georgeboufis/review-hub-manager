import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Feedback = Tables<'feedback'>;
export type FeedbackInsert = TablesInsert<'feedback'>;

/**
 * Service class for managing user feedback in Supabase
 */
export class FeedbackService {
  /**
   * Submit user feedback
   */
  static async submitFeedback(feedback: {
    rating: number;
    comment?: string;
  }): Promise<{ data: Feedback | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          rating: feedback.rating,
          comment: feedback.comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's feedback history
   */
  static async getUserFeedback(): Promise<{ data: Feedback[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      return { data: null, error };
    }
  }
}
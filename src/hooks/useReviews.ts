import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewsService, Review } from '@/services/reviewsService';
import { subscribeToReviews } from '@/services/reviewsService';

/**
 * Custom hook for managing reviews with real-time updates
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch reviews
  const fetchReviews = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    const { data, error } = await ReviewsService.getUserReviews();
    
    if (error) {
      setError(error.message || 'Failed to fetch reviews');
    } else {
      setReviews(data || []);
    }
    
    setLoading(false);
  };

  // Create review
  const createReview = async (reviewData: {
    platform: string;
    guest_name: string;
    date: string;
    rating: number;
    review_text: string;
  }) => {
    const { data, error } = await ReviewsService.createReview(reviewData);
    
    if (error) {
      setError(error.message || 'Failed to create review');
      return { success: false, error };
    }
    
    // Refresh reviews after creation
    fetchReviews();
    return { success: true, data };
  };

  // Update review with reply
  const updateReviewReply = async (id: string, replyText: string) => {
    const { data, error } = await ReviewsService.updateReviewReply(id, replyText);
    
    if (error) {
      setError(error.message || 'Failed to update review');
      return { success: false, error };
    }
    
    // Update local state
    setReviews(prev => prev.map(review => 
      review.id === id 
        ? { ...review, reply_text: replyText, replied: true }
        : review
    ));
    
    return { success: true, data };
  };

  // Delete review
  const deleteReview = async (id: string) => {
    const { error } = await ReviewsService.deleteReview(id);
    
    if (error) {
      setError(error.message || 'Failed to delete review');
      return { success: false, error };
    }
    
    // Remove from local state
    setReviews(prev => prev.filter(review => review.id !== id));
    return { success: true };
  };

  // Initialize dummy data for new users
  const initializeDummyData = async () => {
    const { error } = await ReviewsService.insertDummyData();
    if (!error) {
      fetchReviews();
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    // Fetch initial data
    fetchReviews();

    // Set up real-time subscription
    const unsubscribe = subscribeToReviews(user.id, (payload) => {
      console.log('Real-time update:', payload);
      // Refresh data when changes occur
      fetchReviews();
    });

    return unsubscribe;
  }, [user]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReviewReply,
    deleteReview,
    initializeDummyData,
    clearError: () => setError(null),
  };
};

/**
 * Hook for analytics data
 */
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    averageRating: 0,
    pendingReplies: 0,
    platformDistribution: {} as Record<string, number>,
    recentReviews: [] as Review[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    const { data, error } = await ReviewsService.getAnalytics();
    
    if (error) {
      setError(error.message || 'Failed to fetch analytics');
    } else if (data) {
      setAnalytics(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
};
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
    if (!user) {
      console.log('No user found for fetching reviews');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await ReviewsService.getUserReviews();
      
      if (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message || 'Failed to fetch reviews');
      } else {
        console.log('Reviews fetched successfully:', data?.length || 0);
        setReviews(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching reviews:', err);
      setError('Unexpected error occurred');
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
    if (!user) {
      console.log('No user found for initializing dummy data');
      return;
    }
    
    try {
      const { error } = await ReviewsService.insertDummyData();
      if (error) {
        console.error('Error inserting dummy data:', error);
      } else {
        console.log('Dummy data initialized successfully');
        fetchReviews();
      }
    } catch (err) {
      console.error('Unexpected error initializing dummy data:', err);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) {
      console.log('No user, skipping reviews setup');
      setLoading(false);
      return;
    }

    console.log('Setting up reviews for user:', user.id);
    
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
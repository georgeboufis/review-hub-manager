import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const checkSubscription = async (): Promise<SubscriptionStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Error checking subscription:', error);
      return { subscribed: false };
    }
    
    return data;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { subscribed: false };
  }
};

export const createCheckoutSession = async (): Promise<{ url?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout');
    
    if (error) {
      console.error('Error creating checkout session:', error);
      return { error: error.message };
    }
    
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'Failed to create checkout session' };
  }
};

export const createCustomerPortalSession = async (): Promise<{ url?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      console.error('Error creating customer portal session:', error);
      return { error: error.message };
    }
    
    return data;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return { error: 'Failed to create customer portal session' };
  }
};

export const getReviewCount = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting review count:', error);
      return 0;
    }
    
    return data?.length || 0;
  } catch (error) {
    console.error('Error getting review count:', error);
    return 0;
  }
};

export const canAddReview = async (): Promise<boolean> => {
  const subscriptionStatus = await checkSubscription();
  
  if (subscriptionStatus.subscribed) {
    return true; // Unlimited reviews for paid users
  }
  
  const reviewCount = await getReviewCount();
  return reviewCount < 10; // Free users can have up to 10 reviews
};
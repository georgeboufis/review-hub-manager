import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type PricingData = Tables<'pricing'>;
export type PricingInsert = TablesInsert<'pricing'>;
export type PricingUpdate = TablesUpdate<'pricing'>;

/**
 * Service class for managing pricing data in Supabase
 */
export class PricingService {
  /**
   * Get pricing data for the current user
   */
  static async getUserPricingData(): Promise<{ data: PricingData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      return { data: null, error };
    }
  }

  /**
   * Get pricing data by platform
   */
  static async getPricingByPlatform(platform: string): Promise<{ data: PricingData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .eq('platform', platform)
        .order('date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching pricing data by platform:', error);
      return { data: null, error };
    }
  }

  /**
   * Get latest pricing for each platform
   */
  static async getLatestPricing(): Promise<{ data: Record<string, PricingData> | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Group by platform and get the latest entry for each
      const latestByPlatform: Record<string, PricingData> = {};
      
      for (const pricing of data || []) {
        if (!latestByPlatform[pricing.platform] || 
            new Date(pricing.date) > new Date(latestByPlatform[pricing.platform].date)) {
          latestByPlatform[pricing.platform] = pricing;
        }
      }

      return { data: latestByPlatform, error: null };
    } catch (error) {
      console.error('Error fetching latest pricing:', error);
      return { data: null, error };
    }
  }

  /**
   * Get pricing analytics
   */
  static async getPricingAnalytics(): Promise<{
    data: {
      averagePrice: number;
      pricesByPlatform: Record<string, number>;
      priceHistory: Array<{ date: string; price: number; platform: string }>;
      totalEntries: number;
    } | null;
    error: any;
  }> {
    try {
      const { data: pricingData, error } = await this.getUserPricingData();
      if (error || !pricingData) throw error;

      const totalEntries = pricingData.length;
      const validPrices = pricingData.filter(p => p.price !== null).map(p => p.price!);
      const averagePrice = validPrices.length > 0 
        ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length 
        : 0;

      // Calculate average price by platform
      const pricesByPlatform: Record<string, number> = {};
      const platformGroups = pricingData.reduce((acc, pricing) => {
        if (pricing.price !== null) {
          if (!acc[pricing.platform]) {
            acc[pricing.platform] = [];
          }
          acc[pricing.platform].push(pricing.price);
        }
        return acc;
      }, {} as Record<string, number[]>);

      for (const [platform, prices] of Object.entries(platformGroups)) {
        pricesByPlatform[platform] = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      }

      // Price history for charts
      const priceHistory = pricingData
        .filter(p => p.price !== null)
        .map(p => ({
          date: p.date,
          price: p.price!,
          platform: p.platform
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        data: {
          averagePrice: Math.round(averagePrice * 100) / 100,
          pricesByPlatform,
          priceHistory,
          totalEntries
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching pricing analytics:', error);
      return { data: null, error };
    }
  }

  /**
   * Manually trigger data sync
   */
  static async triggerDataSync(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('daily-data-sync');
      
      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error triggering data sync:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

/**
 * Real-time subscription hook for pricing data
 */
export const subscribeToPricing = (
  userId: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel('pricing_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'pricing',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
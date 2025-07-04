import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface ScrapingResult {
  platform: string;
  price?: number;
  currency?: string;
  property_id?: string;
  reviews?: Array<{
    guest_name: string;
    rating: number;
    review_text: string;
    date: string;
  }>;
}

async function scrapeBookingData(propertyId: string): Promise<ScrapingResult> {
  const scraperApiKey = Deno.env.get('SCRAPERAPI_KEY');
  const bookingUrl = `https://www.booking.com/hotel/gr/property-${propertyId}.html`;
  
  try {
    const response = await fetch(`https://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(bookingUrl)}`);
    const html = await response.text();
    
    // Basic price extraction - this would need to be refined based on actual HTML structure
    const priceMatch = html.match(/EUR\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;
    
    return {
      platform: 'booking',
      price: price,
      currency: 'EUR',
      property_id: propertyId,
      reviews: [] // Reviews would be extracted similarly
    };
  } catch (error) {
    console.error('Error scraping Booking.com:', error);
    return { platform: 'booking', property_id: propertyId };
  }
}

async function scrapeAirbnbData(propertyId: string): Promise<ScrapingResult> {
  const scraperApiKey = Deno.env.get('SCRAPERAPI_KEY');
  const airbnbUrl = `https://www.airbnb.com/rooms/${propertyId}`;
  
  try {
    const response = await fetch(`https://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(airbnbUrl)}`);
    const html = await response.text();
    
    // Basic price extraction - this would need to be refined based on actual HTML structure
    const priceMatch = html.match(/€([0-9,]+(?:\.[0-9]{2})?)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;
    
    return {
      platform: 'airbnb',
      price: price,
      currency: 'EUR',
      property_id: propertyId,
      reviews: [] // Reviews would be extracted similarly
    };
  } catch (error) {
    console.error('Error scraping Airbnb:', error);
    return { platform: 'airbnb', property_id: propertyId };
  }
}

async function fetchGoogleReviews(placeId: string): Promise<ScrapingResult> {
  const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${googleApiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data);
      return { platform: 'google', property_id: placeId };
    }
    
    const reviews = (data.result?.reviews || []).map((review: any) => ({
      guest_name: review.author_name || 'Anonymous',
      rating: review.rating || 5,
      review_text: review.text || '',
      date: review.time ? new Date(review.time * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
    
    return {
      platform: 'google',
      property_id: placeId,
      reviews: reviews
    };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return { platform: 'google', property_id: placeId };
  }
}

async function syncDataForAllUsers() {
  console.log('Starting daily data sync...');
  
  // Get all user integrations
  const { data: integrations, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching integrations:', error);
    return;
  }
  
  for (const integration of integrations || []) {
    try {
      const credentials = integration.credentials as any;
      let results: ScrapingResult[] = [];
      
      switch (integration.platform) {
        case 'google':
          if (credentials.place_id) {
            results.push(await fetchGoogleReviews(credentials.place_id));
          }
          break;
        case 'booking':
          if (credentials.property_id) {
            results.push(await scrapeBookingData(credentials.property_id));
          }
          break;
        case 'airbnb':
          if (credentials.property_id) {
            results.push(await scrapeAirbnbData(credentials.property_id));
          }
          break;
      }
      
      // Store pricing data
      for (const result of results) {
        if (result.price) {
          // Check if price has changed
          const { data: existingPrice } = await supabase
            .from('pricing')
            .select('price')
            .eq('user_id', integration.user_id)
            .eq('platform', result.platform)
            .eq('property_id', result.property_id || '')
            .eq('date', new Date().toISOString().split('T')[0])
            .single();
          
          if (!existingPrice || existingPrice.price !== result.price) {
            await supabase
              .from('pricing')
              .upsert({
                user_id: integration.user_id,
                platform: result.platform,
                property_id: result.property_id || '',
                price: result.price,
                currency: result.currency || 'EUR',
                date: new Date().toISOString().split('T')[0]
              });
            
            console.log(`Updated ${result.platform} price for user ${integration.user_id}: €${result.price}`);
          }
        }
        
        // Store reviews
        for (const review of result.reviews || []) {
          // Check if review already exists
          const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', integration.user_id)
            .eq('platform', result.platform)
            .eq('guest_name', review.guest_name)
            .eq('review_text', review.review_text)
            .single();
          
          if (!existingReview) {
            await supabase
              .from('reviews')
              .insert({
                user_id: integration.user_id,
                platform: result.platform,
                guest_name: review.guest_name,
                rating: review.rating,
                review_text: review.review_text,
                date: review.date
              });
            
            console.log(`Added new ${result.platform} review for user ${integration.user_id}`);
          }
        }
      }
      
      // Update last sync time
      await supabase
        .from('user_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', integration.id);
        
    } catch (error) {
      console.error(`Error syncing data for integration ${integration.id}:`, error);
    }
  }
  
  console.log('Daily data sync completed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    await syncDataForAllUsers();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Data sync completed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in daily sync:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { placeId } = await req.json()

    if (!placeId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing placeId', reviews: [], count: 0, code: 'missing_place_id' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server is missing GOOGLE_PLACES_API_KEY secret', code: 'missing_api_key', reviews: [], count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch reviews from Google Places API using server-side secret
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return new Response(
        JSON.stringify({ success: false, error: `Google API Error: ${data.status} - ${data.error_message || 'Unknown error'}`, code: 'google_api_error', reviews: [], count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const reviews = data.result?.reviews || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        reviews,
        count: reviews.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-google-reviews function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message,
        code: 'internal_error',
        reviews: [],
        count: 0 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
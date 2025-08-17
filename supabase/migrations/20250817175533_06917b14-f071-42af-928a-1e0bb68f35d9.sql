-- Fix security vulnerability: Remove email-based access from subscribers SELECT policy
-- This prevents users from accessing other users' subscription data if they know their email

-- Drop the existing SELECT policy that allows email-based access
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create a secure SELECT policy that only allows user_id-based access
CREATE POLICY "users_can_view_own_subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());
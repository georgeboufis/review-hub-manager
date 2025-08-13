-- Fix security vulnerabilities in subscribers table RLS policies
-- Replace overly permissive policies with secure, user-restricted ones

-- Drop existing problematic policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure insert policy - only authenticated users can create their own subscription
CREATE POLICY "authenticated_users_can_create_own_subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Create secure update policy - users can only update their own subscription data
CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ensure the user_id column is not nullable for security
-- This prevents orphaned records and ensures proper access control
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;
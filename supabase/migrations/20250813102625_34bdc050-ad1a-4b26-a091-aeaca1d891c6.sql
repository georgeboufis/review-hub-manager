-- Fix security vulnerability in subscribers table RLS policies

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure INSERT policy - only authenticated users can create their own subscription
CREATE POLICY "authenticated_users_can_create_own_subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create secure UPDATE policy - users can only update their own subscription
CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure user_id column is NOT NULL to prevent security bypasses
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;
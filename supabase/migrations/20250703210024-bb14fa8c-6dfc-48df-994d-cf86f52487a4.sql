-- Fix Function Search Path Mutable warnings by setting search_path = public

-- Update handle_new_user function to use public search_path instead of empty
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, business_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'given_name', split_part(NEW.raw_user_meta_data ->> 'full_name', ' ', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NEW.raw_user_meta_data ->> 'family_name', split_part(NEW.raw_user_meta_data ->> 'full_name', ' ', 2)), 
    NEW.raw_user_meta_data ->> 'business_name'
  );
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function to add search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;

-- Update log_credential_access function to add search_path
CREATE OR REPLACE FUNCTION public.log_credential_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update access tracking on SELECT operations
  IF TG_OP = 'SELECT' THEN
    UPDATE public.user_integrations 
    SET 
      last_accessed = NOW(),
      access_count = COALESCE(access_count, 0) + 1
    WHERE id = NEW.id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Update insert_dummy_reviews function to add search_path
CREATE OR REPLACE FUNCTION public.insert_dummy_reviews(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.reviews (platform, guest_name, date, rating, review_text, reply_text, replied, user_id) VALUES
    ('booking', 'Sarah Johnson', '2024-06-15', 5, 'Amazing stay! The apartment was spotless and exactly as described. Host was very responsive and helpful throughout our visit.', 'Thank you so much Sarah! We''re delighted you enjoyed your stay with us.', true, _user_id),
    ('airbnb', 'Mike Chen', '2024-06-10', 4, 'Great location and clean space. Only minor issue was the WiFi being a bit slow, but everything else was perfect.', NULL, false, _user_id),
    ('google', 'Emma Wilson', '2024-06-08', 5, 'Fantastic experience! Beautiful apartment in the heart of the city. Would definitely recommend to anyone visiting.', 'We appreciate your wonderful review Emma! Hope to host you again soon.', true, _user_id),
    ('tripadvisor', 'David Brown', '2024-06-05', 3, 'The place was okay, but not as clean as expected. The location was good though.', NULL, false, _user_id),
    ('booking', 'Lisa Garcia', '2024-06-01', 5, 'Outstanding hospitality! The host went above and beyond to make our stay comfortable. Highly recommended!', 'Thank you Lisa! Your kind words mean the world to us.', true, _user_id),
    ('airbnb', 'John Smith', '2024-05-28', 4, 'Nice apartment with great amenities. Check-in process was smooth and the host was very accommodating.', NULL, false, _user_id),
    ('google', 'Maria Rodriguez', '2024-05-25', 5, 'Perfect location, beautiful space, and excellent communication from the host. Everything was exactly as promised.', 'Thanks Maria! We''re so happy you had a great experience.', true, _user_id),
    ('booking', 'Tom Anderson', '2024-05-20', 2, 'Had some issues with the heating and the place wasn''t as clean as expected. Location was good but overall disappointed.', NULL, false, _user_id);
END;
$$;
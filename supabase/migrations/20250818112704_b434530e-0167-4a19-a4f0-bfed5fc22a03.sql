-- Remove duplicate reviews, keeping only the earliest created for each duplicate set
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY guest_name, platform, rating, review_text, user_id 
      ORDER BY created_at ASC
    ) as rn
  FROM reviews
)
DELETE FROM reviews 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
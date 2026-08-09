-- Migration V7: Make user_id nullable in urls table for anonymous/public URL shortening
ALTER TABLE urls ALTER COLUMN user_id DROP NOT NULL;

-- Add route_coordinates column to store full route geometry for thumbnails
-- Run this migration in your Supabase SQL Editor

ALTER TABLE routes
ADD COLUMN route_coordinates jsonb DEFAULT '[]';

COMMENT ON COLUMN routes.route_coordinates IS 'Full route geometry as JSON array of [lng, lat] coordinates for map thumbnails';

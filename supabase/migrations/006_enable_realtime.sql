-- Enable Supabase Realtime for profile and screen tables
-- This allows the mobile app to receive instant updates when layouts are changed on the web

-- Enable replica identity for change tracking (required for realtime)
ALTER TABLE data_profiles REPLICA IDENTITY FULL;
ALTER TABLE profile_screens REPLICA IDENTITY FULL;

-- Add tables to the Supabase realtime publication
-- Note: supabase_realtime publication is created by default in Supabase projects
ALTER PUBLICATION supabase_realtime ADD TABLE data_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE profile_screens;

-- Add a comment explaining the realtime setup
COMMENT ON TABLE data_profiles IS 'User layout profiles with realtime sync enabled for mobile app';
COMMENT ON TABLE profile_screens IS 'Individual screens within profiles with realtime sync enabled';

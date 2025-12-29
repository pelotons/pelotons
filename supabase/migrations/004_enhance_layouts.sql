-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Data profiles (collection of screens)
-- A profile represents a cycling configuration (e.g., "Road Cycling", "MTB")
-- that contains multiple screens the user can scroll through while riding
CREATE TABLE data_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  device_type text NOT NULL DEFAULT 'iphone_14',
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Screens within a profile
-- Each screen can be a data screen (with widgets) or a map screen
-- Users scroll through screens in position order while riding
CREATE TABLE profile_screens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES data_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  screen_type text NOT NULL CHECK (screen_type IN ('data', 'map')),
  position integer NOT NULL DEFAULT 0,
  grid_columns integer NOT NULL DEFAULT 3,
  grid_rows integer NOT NULL DEFAULT 4,
  widgets jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE data_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_screens ENABLE ROW LEVEL SECURITY;

-- RLS policies for data_profiles
CREATE POLICY "Users can view own profiles"
  ON data_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profiles"
  ON data_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON data_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON data_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for profile_screens
CREATE POLICY "Users can view own screens"
  ON profile_screens FOR SELECT
  USING (profile_id IN (SELECT id FROM data_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create own screens"
  ON profile_screens FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM data_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own screens"
  ON profile_screens FOR UPDATE
  USING (profile_id IN (SELECT id FROM data_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own screens"
  ON profile_screens FOR DELETE
  USING (profile_id IN (SELECT id FROM data_profiles WHERE user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX idx_data_profiles_user ON data_profiles(user_id);
CREATE INDEX idx_data_profiles_active ON data_profiles(user_id, is_active);
CREATE INDEX idx_profile_screens_profile ON profile_screens(profile_id);
CREATE INDEX idx_profile_screens_position ON profile_screens(profile_id, position);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_data_profiles_updated_at
  BEFORE UPDATE ON data_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_screens_updated_at
  BEFORE UPDATE ON profile_screens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

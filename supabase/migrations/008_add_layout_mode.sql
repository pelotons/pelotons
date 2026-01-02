-- Add priority layout mode support to profile_screens
-- These fields enable the new Wahoo-inspired priority-based layouts

-- Layout mode: 'grid' (traditional equal cells) or 'priority' (variable-sized slots)
ALTER TABLE profile_screens
ADD COLUMN IF NOT EXISTS layout_mode TEXT DEFAULT 'grid';

-- ID of the layout preset when in priority mode (e.g., 'focus', 'balanced', 'standard', 'dense')
ALTER TABLE profile_screens
ADD COLUMN IF NOT EXISTS layout_preset_id TEXT;

-- Widget assignments to slots in priority mode (JSON array of {slotId, widgetType})
ALTER TABLE profile_screens
ADD COLUMN IF NOT EXISTS slot_assignments JSONB DEFAULT '[]'::jsonb;

-- Add constraint to validate layout_mode values
ALTER TABLE profile_screens
ADD CONSTRAINT check_layout_mode
CHECK (layout_mode IN ('grid', 'priority'));

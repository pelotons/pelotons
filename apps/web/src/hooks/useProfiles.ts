import { useState, useEffect, useCallback } from 'react';
import { supabase, DbDataProfile, DbProfileScreen } from '@/lib/supabase';
import {
  DataProfile,
  DataProfileInsert,
  DataProfileUpdate,
  DataProfileWithScreens,
  ProfileScreen,
  ProfileScreenInsert,
  ProfileScreenUpdate,
  Widget,
} from '@peloton/shared';
import { useAuth } from '@/components/Auth/AuthProvider';

function dbToProfile(db: DbDataProfile): DataProfile {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    deviceType: db.device_type,
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function dbToScreen(db: DbProfileScreen): ProfileScreen {
  return {
    id: db.id,
    profileId: db.profile_id,
    name: db.name,
    screenType: db.screen_type,
    position: db.position,
    gridColumns: db.grid_columns,
    gridRows: db.grid_rows,
    widgets: db.widgets as Widget[],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function useProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('data_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        // Check if the error is because the table doesn't exist
        if (fetchError.message.includes('does not exist') || fetchError.code === '42P01') {
          setError('Database tables not found. Please run the migration: 004_enhance_layouts.sql');
        } else {
          setError(fetchError.message);
        }
        setProfiles([]);
      } else {
        setProfiles((data as DbDataProfile[] || []).map(dbToProfile));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch profiles');
      setProfiles([]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Profile CRUD operations
  const createProfile = async (data: DataProfileInsert): Promise<DataProfile | null> => {
    if (!user) return null;

    const { data: newProfile, error: createError } = await supabase
      .from('data_profiles')
      .insert({
        user_id: user.id,
        name: data.name,
        device_type: data.deviceType,
        is_active: data.isActive ?? false,
      })
      .select()
      .single();

    if (createError) {
      setError(createError.message);
      return null;
    }

    const profile = dbToProfile(newProfile as DbDataProfile);
    setProfiles((prev) => [profile, ...prev]);
    return profile;
  };

  const updateProfile = async (
    id: string,
    updates: DataProfileUpdate
  ): Promise<DataProfile | null> => {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.deviceType !== undefined) updateData.device_type = updates.deviceType;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error: updateError } = await supabase
      .from('data_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      return null;
    }

    const updated = dbToProfile(data as DbDataProfile);
    setProfiles((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProfile = async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('data_profiles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    setProfiles((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const setActiveProfile = async (id: string): Promise<boolean> => {
    if (!user) return false;

    // First, deactivate all profiles for this user
    const { error: deactivateError } = await supabase
      .from('data_profiles')
      .update({ is_active: false })
      .eq('user_id', user.id);

    if (deactivateError) {
      setError(deactivateError.message);
      return false;
    }

    // Then activate the specified profile
    const { error: activateError } = await supabase
      .from('data_profiles')
      .update({ is_active: true })
      .eq('id', id);

    if (activateError) {
      setError(activateError.message);
      return false;
    }

    setProfiles((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );
    return true;
  };

  // Get profile with all its screens
  const getProfileWithScreens = useCallback(async (
    profileId: string
  ): Promise<DataProfileWithScreens | null> => {
    const { data: profileData, error: profileError } = await supabase
      .from('data_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError) {
      setError(profileError.message);
      return null;
    }

    const { data: screensData, error: screensError } = await supabase
      .from('profile_screens')
      .select('*')
      .eq('profile_id', profileId)
      .order('position', { ascending: true });

    if (screensError) {
      setError(screensError.message);
      return null;
    }

    return {
      ...dbToProfile(profileData as DbDataProfile),
      screens: (screensData as DbProfileScreen[]).map(dbToScreen),
    };
  }, []);

  // Screen CRUD operations
  const addScreen = async (data: ProfileScreenInsert): Promise<ProfileScreen | null> => {
    // Get current max position for this profile
    const { data: existingScreens } = await supabase
      .from('profile_screens')
      .select('position')
      .eq('profile_id', data.profileId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = existingScreens && existingScreens.length > 0
      ? existingScreens[0].position + 1
      : 0;

    const { data: newScreen, error: createError } = await supabase
      .from('profile_screens')
      .insert({
        profile_id: data.profileId,
        name: data.name,
        screen_type: data.screenType,
        position: data.position ?? nextPosition,
        grid_columns: data.gridColumns ?? 3,
        grid_rows: data.gridRows ?? 4,
        widgets: data.widgets ?? [],
      })
      .select()
      .single();

    if (createError) {
      setError(createError.message);
      return null;
    }

    return dbToScreen(newScreen as DbProfileScreen);
  };

  const updateScreen = async (
    screenId: string,
    updates: ProfileScreenUpdate
  ): Promise<ProfileScreen | null> => {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.gridColumns !== undefined) updateData.grid_columns = updates.gridColumns;
    if (updates.gridRows !== undefined) updateData.grid_rows = updates.gridRows;
    if (updates.widgets !== undefined) updateData.widgets = updates.widgets;

    const { data, error: updateError } = await supabase
      .from('profile_screens')
      .update(updateData)
      .eq('id', screenId)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      return null;
    }

    return dbToScreen(data as DbProfileScreen);
  };

  const deleteScreen = async (screenId: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('profile_screens')
      .delete()
      .eq('id', screenId);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    return true;
  };

  const reorderScreens = async (
    profileId: string,
    screenIds: string[]
  ): Promise<boolean> => {
    const updates = screenIds.map((screenId, index) =>
      supabase
        .from('profile_screens')
        .update({ position: index })
        .eq('id', screenId)
        .eq('profile_id', profileId)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      setError('Failed to reorder screens');
      return false;
    }

    return true;
  };

  return {
    // State
    profiles,
    loading,
    error,

    // Profile operations
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    getProfileWithScreens,

    // Screen operations
    addScreen,
    updateScreen,
    deleteScreen,
    reorderScreens,

    // Utility
    refetch: fetchProfiles,
  };
}

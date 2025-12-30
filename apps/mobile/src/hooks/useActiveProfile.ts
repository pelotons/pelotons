import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataProfileWithScreens, ProfileScreen, Widget } from '@peloton/shared';
import { useAuth } from './useAuth';

interface UseActiveProfileResult {
  profile: DataProfileWithScreens | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch the user's active profile with all its screens.
 * Returns the profile data synced from the web layout builder.
 */
export function useActiveProfile(): UseActiveProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DataProfileWithScreens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActiveProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch active profile with its screens in a single query
      const { data: profileData, error: profileError } = await supabase
        .from('data_profiles')
        .select(`
          *,
          profile_screens (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (profileError) {
        // No active profile found - this is okay for new users
        if (profileError.code === 'PGRST116') {
          setProfile(null);
          setLoading(false);
          return;
        }
        throw profileError;
      }

      if (profileData) {
        // Transform snake_case database response to camelCase TypeScript types
        const transformedProfile: DataProfileWithScreens = {
          id: profileData.id,
          userId: profileData.user_id,
          name: profileData.name,
          deviceType: profileData.device_type,
          isActive: profileData.is_active,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
          screens: (profileData.profile_screens || [])
            .map((screen: any): ProfileScreen => ({
              id: screen.id,
              profileId: screen.profile_id,
              name: screen.name,
              screenType: screen.screen_type,
              position: screen.position,
              gridColumns: screen.grid_columns,
              gridRows: screen.grid_rows,
              widgets: (screen.widgets as Widget[]) || [],
              createdAt: screen.created_at,
              updatedAt: screen.updated_at,
            }))
            .sort((a: ProfileScreen, b: ProfileScreen) => a.position - b.position),
        };

        setProfile(transformedProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching active profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    refetch: fetchActiveProfile,
  };
}

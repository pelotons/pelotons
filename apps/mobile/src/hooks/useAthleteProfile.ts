import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AthleteProfile } from '@peloton/shared';
import { useAuth } from './useAuth';

interface UseAthleteProfileResult {
  profile: AthleteProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch the user's athlete profile (FTP, max HR, weight, etc.)
 * Used for zone calculations and W/kg display
 */
export function useAthleteProfile(): UseAthleteProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAthleteProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // No profile found - this is okay for new users
        if (fetchError.code === 'PGRST116') {
          setProfile(null);
          setLoading(false);
          return;
        }
        throw fetchError;
      }

      if (data) {
        // Transform snake_case database response to camelCase TypeScript types
        const transformedProfile: AthleteProfile = {
          id: data.id,
          userId: data.user_id,
          displayName: data.display_name,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          weightKg: data.weight_kg,
          heightCm: data.height_cm,
          ftpWatts: data.ftp_watts,
          maxHrBpm: data.max_hr_bpm,
          restingHrBpm: data.resting_hr_bpm,
          lthrBpm: data.lthr_bpm,
          unitSystem: data.unit_system,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        setProfile(transformedProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching athlete profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch athlete profile'));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthleteProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    refetch: fetchAthleteProfile,
  };
}

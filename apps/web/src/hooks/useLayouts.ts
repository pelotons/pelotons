import { useState, useEffect, useCallback } from 'react';
import { supabase, DbLayout, parseWidgets } from '@/lib/supabase';
import { Layout, LayoutInsert } from '@peloton/shared';
import { useAuth } from '@/components/Auth/AuthProvider';

// =============================================================================
// DATABASE TRANSFORMATION
// =============================================================================

/**
 * Transform database row to domain model
 * Uses type guards to safely parse JSON fields
 */
function dbToLayout(db: DbLayout): Layout {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    screenType: db.screen_type,
    widgets: parseWidgets(db.widgets),
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function useLayouts() {
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all layouts for the current user
   */
  const fetchLayouts = useCallback(async () => {
    if (!user) {
      setLayouts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('layouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setLayouts((data as DbLayout[]).map(dbToLayout));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch layouts';
      console.error('useLayouts.fetchLayouts:', message);
      setError(message);
      setLayouts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  /**
   * Create a new layout
   */
  const createLayout = async (layout: LayoutInsert): Promise<Layout | null> => {
    if (!user) {
      setError('You must be logged in to create a layout');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('layouts')
        .insert({
          user_id: user.id,
          name: layout.name,
          screen_type: layout.screenType,
          widgets: layout.widgets,
          is_active: layout.isActive ?? false,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const newLayout = dbToLayout(data as DbLayout);
      setLayouts((prev) => [newLayout, ...prev]);
      return newLayout;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create layout';
      console.error('useLayouts.createLayout:', message);
      setError(message);
      return null;
    }
  };

  /**
   * Update an existing layout
   */
  const updateLayout = async (
    id: string,
    updates: Partial<LayoutInsert>
  ): Promise<Layout | null> => {
    if (!user) {
      setError('You must be logged in to update a layout');
      return null;
    }

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.screenType !== undefined) updateData.screen_type = updates.screenType;
    if (updates.widgets !== undefined) updateData.widgets = updates.widgets;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    try {
      const { data, error: updateError } = await supabase
        .from('layouts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      const updatedLayout = dbToLayout(data as DbLayout);
      setLayouts((prev) => prev.map((l) => (l.id === id ? updatedLayout : l)));
      return updatedLayout;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update layout';
      console.error('useLayouts.updateLayout:', message);
      setError(message);
      return null;
    }
  };

  /**
   * Delete a layout
   */
  const deleteLayout = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to delete a layout');
      return false;
    }

    try {
      const { error: deleteError } = await supabase.from('layouts').delete().eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setLayouts((prev) => prev.filter((l) => l.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete layout';
      console.error('useLayouts.deleteLayout:', message);
      setError(message);
      return false;
    }
  };

  /**
   * Set a layout as active (deactivates all others)
   */
  const setActiveLayout = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to set active layout');
      return false;
    }

    try {
      // First, deactivate all layouts for this user
      const { error: deactivateError } = await supabase
        .from('layouts')
        .update({ is_active: false })
        .eq('user_id', user.id);

      if (deactivateError) {
        throw new Error(deactivateError.message);
      }

      // Then activate the selected one
      const { error: activateError } = await supabase
        .from('layouts')
        .update({ is_active: true })
        .eq('id', id);

      if (activateError) {
        throw new Error(activateError.message);
      }

      setLayouts((prev) => prev.map((l) => ({ ...l, isActive: l.id === id })));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set active layout';
      console.error('useLayouts.setActiveLayout:', message);
      setError(message);
      return false;
    }
  };

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    layouts,
    loading,
    error,
    createLayout,
    updateLayout,
    deleteLayout,
    setActiveLayout,
    refetch: fetchLayouts,
    clearError,
  };
}

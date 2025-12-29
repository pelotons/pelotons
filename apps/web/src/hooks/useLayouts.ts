import { useState, useEffect, useCallback } from 'react';
import { supabase, DbLayout } from '@/lib/supabase';
import { Layout, LayoutInsert, Widget } from '@peloton/shared';
import { useAuth } from '@/components/Auth/AuthProvider';

function dbToLayout(db: DbLayout): Layout {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    screenType: db.screen_type,
    widgets: db.widgets as Widget[],
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function useLayouts() {
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLayouts = useCallback(async () => {
    if (!user) {
      setLayouts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('layouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLayouts([]);
    } else {
      setLayouts((data as DbLayout[]).map(dbToLayout));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  const createLayout = async (layout: LayoutInsert): Promise<Layout | null> => {
    if (!user) return null;

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
      setError(insertError.message);
      return null;
    }

    const newLayout = dbToLayout(data as DbLayout);
    setLayouts((prev) => [newLayout, ...prev]);
    return newLayout;
  };

  const updateLayout = async (
    id: string,
    updates: Partial<LayoutInsert>
  ): Promise<Layout | null> => {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.screenType !== undefined) updateData.screen_type = updates.screenType;
    if (updates.widgets !== undefined) updateData.widgets = updates.widgets;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error: updateError } = await supabase
      .from('layouts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      return null;
    }

    const updatedLayout = dbToLayout(data as DbLayout);
    setLayouts((prev) =>
      prev.map((l) => (l.id === id ? updatedLayout : l))
    );
    return updatedLayout;
  };

  const deleteLayout = async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('layouts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    setLayouts((prev) => prev.filter((l) => l.id !== id));
    return true;
  };

  const setActiveLayout = async (id: string): Promise<boolean> => {
    if (!user) return false;

    // First, deactivate all layouts
    await supabase
      .from('layouts')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Then activate the selected one
    const { error: updateError } = await supabase
      .from('layouts')
      .update({ is_active: true })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return false;
    }

    setLayouts((prev) =>
      prev.map((l) => ({ ...l, isActive: l.id === id }))
    );
    return true;
  };

  return {
    layouts,
    loading,
    error,
    createLayout,
    updateLayout,
    deleteLayout,
    setActiveLayout,
    refetch: fetchLayouts,
  };
}

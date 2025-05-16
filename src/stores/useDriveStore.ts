// stores/driveStore.ts
import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type DriveItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path?: string | null;
  parent_id: string | null;
  owner_id: string;
  is_trashed: boolean;
  created_at: string;
};

type DriveStore = {
  items: DriveItem[];
  loading: boolean;
  fetchItems: (parentId?: string | null) => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<void>;
  uploadFile: (file: File, parentId?: string | null) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  restoreItem: (id: string) => Promise<void>;
  shareItem: (itemId: string, userId: string, permission?: string) => Promise<void>;
  fetchSharedWithMe: () => Promise<DriveItem[]>;
};

export const useDriveStore = create<DriveStore>((set, get) => ({


  items: [],
  loading: false,

  fetchItems: async (parentId = null) => {
    set({ loading: true });
    const { data, error } = await createClient()
      .from('items')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_trashed', false)
      .order('created_at', { ascending: true });
    if (!error) set({ items: data });
    set({ loading: false });
  },

  createFolder: async (name, parentId = null) => {
    const { data, error } = await createClient()
      .from('items')
      .insert({
        name,
        type: 'folder',
        parent_id: parentId,
      })
      .select()
      .single();

    if (!error && data) {
      set({ items: [...get().items, data] });
    }
  },

  uploadFile: async (file, parentId = null) => {
    const {
      data: { user },
    } = await createClient().auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${parentId ?? 'root'}/${file.name}`;
    const { error: uploadError } = await createClient().storage
      .from('cloud')
      .upload(filePath, file);

    if (!uploadError) {
      const { data, error } = await createClient()
        .from('items')
        .insert({
          name: file.name,
          type: 'file',
          parent_id: parentId,
          path: filePath,
        })
        .select()
        .single();
      if (!error && data) {
        set({ items: [...get().items, data] });
      }
    }
  },

  moveToTrash: async (id) => {
    const { data, error } = await createClient()
      .from('items')
      .update({ is_trashed: true })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      set({ items: get().items.filter((i) => i.id !== id) });
    }
  },

  deleteItem: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (item?.type === 'file' && item.path) {
      await createClient().storage.from('cloud').remove([item.path]);
    }

    const { error } = await createClient().from('items').delete().eq('id', id);
    if (!error) {
      set({ items: get().items.filter((i) => i.id !== id) });
    }
  },

  restoreItem: async (id) => {
    const { data, error } = await createClient()
      .from('items')
      .update({ is_trashed: false })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      set({ items: [...get().items, data] });
    }
  },

  shareItem: async (itemId, userId, permission = 'view') => {
    await createClient().from('shared_items').insert({
      item_id: itemId,
      shared_with: userId,
      permission,
    });
  },

  fetchSharedWithMe: async () => {
  // Get the current authenticated user
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) return [];

  // Fetch items shared with this user
  const { data, error } = await createClient()
    .from('shared_items')
    .select('items(*)') // Join with items table
    .eq('shared_with', user.id);

  if (error) {
    console.error('Failed to fetch shared items:', error.message);
    return [];
  }

  // Return valid DriveItem[] by filtering out nulls
  return (
    data
      ?.map((d) => d.items as unknown as DriveItem | null)
      .filter((item): item is DriveItem => item !== null && typeof item === 'object') || []
  );
}
}));


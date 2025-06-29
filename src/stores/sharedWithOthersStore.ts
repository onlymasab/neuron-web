
import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { CloudModel } from '@/types/CloudModel';

interface SharedWithOthersStore {
  sharedFiles: CloudModel[];
  loading: boolean;
  fetchSharedFiles: () => Promise<void>;
  updateSharedFile: (fileId: string, updates: Partial<CloudModel>) => Promise<void>;
  shareFile: (fileId: string, userEmailOrId: string) => Promise<void>;
  unshareFile: (fileId: string, userIdsToRemove: string[]) => Promise<void>;
  trashSharedFile: (fileId: string) => Promise<void>;
  reset: () => void;
}

const supabase = createClient();
let channel: any = null;

export const useSharedWithOthersStore = create<SharedWithOthersStore>((set, get) => ({
  sharedFiles: [],
  loading: false,

  fetchSharedFiles: async () => {
    set({ loading: true });

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      set({ loading: false });
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.from('shared_with_others').select('*');

    if (error) {
      console.error('Fetch shared-with-others files error:', error);
      set({ loading: false });
      throw new Error(error.message);
    }

    set({ sharedFiles: data, loading: false });

    if (!channel) {
      channel = supabase
        .channel(`realtime-shared-with-others-${user.data.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cloud',
            filter: `user_id=eq.${user.data.user.id}`,
          },
          (payload) => {
            const current = get().sharedFiles;

            if (payload.eventType === 'INSERT') {
              set({ sharedFiles: [...current, payload.new as CloudModel] });
            }

            if (payload.eventType === 'UPDATE') {
              set({
                sharedFiles: current.map((f) =>
                  f.id === payload.new.id ? (payload.new as CloudModel) : f
                ),
              });
            }

            if (payload.eventType === 'DELETE') {
              set({
                sharedFiles: current.filter((f) => f.id !== payload.old.id),
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime status [shared_with_others]:', status);
        });
    }
  },

  updateSharedFile: async (fileId, updates) => {
    const updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('cloud')
      .update({ ...updates, updated_at })
      .eq('id', fileId);

    if (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  },

  // ✅ Cleaned up shareFile function

 shareFile: async (fileId, userEmailOrId) => {
  const supabase = createClient();

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('User not authenticated');

  // Find user to share with
  const { data: user, error } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', userEmailOrId) 
    .single();

  if (error || !user) {
    throw new Error('User not found with this email.');
  }

  const targetUserId = user.id;

  // Fetch current shared_with list
  
  const { data: fileData, error: fetchError } = await supabase
    .from('cloud')
    .select('shared_with')
    .eq('id', fileId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch file: ${fetchError.message}`);
  }

  const existingSharedWith = fileData?.shared_with ?? [];

  if (existingSharedWith.includes(targetUserId)) {
    throw new Error('Already shared with this user.');
  }

  const updatedSharedWith = [...existingSharedWith, targetUserId];

  const { error: updateError } = await supabase
    .from('cloud')
    .update({
      shared_with: updatedSharedWith,
      is_shared: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId);

  if (updateError) {
    throw new Error(`Failed to update cloud record: ${updateError.message}`);
  }

  // ✅ Success
  console.log('✅ File shared successfully');
},


  unshareFile: async (fileId, userIdsToRemove) => {
    const { data: fileData, error: fetchError } = await supabase
      .from('cloud')
      .select('shared_with')
      .eq('id', fileId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const updatedSharedWith = (fileData.shared_with || []).filter(
      (uid: string) => !userIdsToRemove.includes(uid)
    );

    const { error: updateError } = await supabase
      .from('cloud')
      .update({
        shared_with: updatedSharedWith,
        updated_at: new Date().toISOString(),
        is_shared: updatedSharedWith.length > 0,
      })
      .eq('id', fileId);

    if (updateError) throw new Error(updateError.message);
  },

  trashSharedFile: async (fileId) => {
    const { error } = await supabase
      .from('cloud')
      .update({
        is_trashed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fileId);

    if (error) throw new Error(error.message);
  },

  reset: () => {
    set({ sharedFiles: [], loading: false });
    if (channel) {
      channel.unsubscribe();
      channel = null;
    }
  },
}));

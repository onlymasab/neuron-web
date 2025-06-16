import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { CloudModel } from '@/types/CloudModel';

interface SharedWithMeStore {
  sharedFiles: CloudModel[];
  loading: boolean;
  fetchSharedFiles: () => Promise<void>;
  reset: () => void;
}

const supabase = createClient();

export const useSharedWithMeStore = create<SharedWithMeStore>((set) => ({
  sharedFiles: [],
  loading: false,

  fetchSharedFiles: async () => {
    set({ loading: true });

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      set({ loading: false });
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('shared_with_me')
      .select('*');

    if (error) {
      console.error('Fetch shared files error:', error);
      set({ loading: false });
      throw new Error(error.message);
    }

    set({ sharedFiles: data, loading: false });
  },

  reset: () => {
    set({ sharedFiles: [], loading: false });
  },
}));
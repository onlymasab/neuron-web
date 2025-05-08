import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  isUserRegistered: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isUserRegistered: false,  // default false, safer before checking DB
  isLoading: true,

  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),

  checkAuth: async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      set({ user: null, isUserRegistered: false, isLoading: false });
      return;
    }

    if (session) {
      const user = session.user;
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user from DB:', error);
      }

      set({
        user,
        isUserRegistered: !!data && !error,
        isLoading: false,
      });
    } else {
      set({ user: null, isUserRegistered: false, isLoading: false });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    set({ user: null, isUserRegistered: false });
  },
}));

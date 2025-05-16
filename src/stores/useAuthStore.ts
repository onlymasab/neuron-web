'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { UserModel, ValidRole } from '@/types/supabase';

type AuthState = {
  user: UserModel | null;
  isLoading: boolean;
  logoUrl: string;
  setUser: (user: UserModel | null) => void;
  setLogoUrl: (url: string) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  logoUrl: '',
  setUser: (user) => set({ user, isLoading: false }),
  setLogoUrl: (url) => set({ logoUrl: url }),

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isLoading: false, logoUrl: '' });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const supabase = createClient();

    console.log('[AuthStore] Running checkAuth...');

    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    console.log('[AuthStore] Session data:', sessionData, 'Session error:', sessionError);

    if (sessionError || !sessionData.user) {
      console.error('[AuthStore] No user found or error:', sessionError?.message);
      set({ user: null, isLoading: false, logoUrl: '' });
      return;
    }

    const userId = sessionData.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        full_name,
        email,
        avatar_url,
        roles (
          role_name
        )
      `)
      .eq('id', userId)
      .single();

    console.log('[AuthStore] Profile data:', profileData, 'Profile error:', profileError);

    if (profileError) {
      console.error('[AuthStore] Profile fetch error:', profileError.message);
      set({ user: null, isLoading: false, logoUrl: '' });
      return;
    }

    const userModel: UserModel = {
      id: userId,
      name: profileData.full_name || sessionData.user.user_metadata?.full_name || 'Unknown',
      email: profileData.email || sessionData.user.email || '',
      avatar: profileData.avatar_url || sessionData.user.user_metadata?.avatar_url || '',
      role: (profileData.roles?.[0]?.role_name || 'user') as ValidRole,
    };

    console.log('[AuthStore] Setting user model:', userModel);

    set({
      user: userModel,
      isLoading: false,
      logoUrl: userModel.avatar,
    });

    // Optional: listen for auth state changes
    supabase.auth.onAuthStateChange(async (_, session) => {
      console.log('[AuthStore] Auth state changed:', session);

      if (!session?.user) {
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          email,
          avatar_url,
          roles (
            role_name
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('[AuthStore] Realtime profile fetch error:', error.message);
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }

      const updatedUser: UserModel = {
        id: session.user.id,
        name: data.full_name || session.user.user_metadata?.full_name || 'Unknown',
        email: data.email || session.user.email || '',
        avatar: data.avatar_url || session.user.user_metadata?.avatar_url || '',
        role: (data.roles?.[0]?.role_name || 'user') as ValidRole,
      };

      console.log('[AuthStore] Updating user on auth change:', updatedUser);

      set({
        user: updatedUser,
        isLoading: false,
        logoUrl: updatedUser.avatar,
      });
    });
  },
}));
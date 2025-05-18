'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { UserModel, ValidRole } from '@/types/UserModel';

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

    console.log('[AuthStore] 🔍 Checking user auth...');

    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !sessionData?.user) {
      console.warn('[AuthStore] ❌ No user session:', sessionError?.message);
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
        role:role_id(role_name)
      `)
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      console.warn('[AuthStore] ❌ Profile fetch failed:', profileError?.message);
      set({ user: null, isLoading: false, logoUrl: '' });
      return;
    }



    const userModel: UserModel = {
      id: userId,
      name: profileData.full_name || sessionData.user.user_metadata?.full_name || 'Unknown',
      email: profileData.email || sessionData.user.email || '',
      avatar: profileData.avatar_url || sessionData.user.user_metadata?.avatar_url || '',
      role: profileData.role.role_name as ValidRole,
    };
    


    set({
      user: userModel,
      isLoading: false,
      logoUrl: userModel.avatar,
    });

    // 🔄 Realtime auth state listener
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session?.user) {
        console.log('[AuthStore] 👋 User signed out');
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          email,
          avatar_url,
          role:role_id(role_name)
        `)
        .eq('id', session.user.id)
        .single();

      if (error || !updatedProfile) {
        console.warn('[AuthStore] ❌ Realtime profile fetch failed:', error?.message);
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }


      const updatedUser : UserModel = {
        id: session.user.id,
        name: updatedProfile.full_name || session.user.user_metadata?.full_name || 'Unknown',
        email: updatedProfile.email || session.user.email || '',
        avatar: updatedProfile.avatar_url || session.user.user_metadata?.avatar_url || '',
        role: updatedProfile.role.role_name,
      };


      set({
        // user: updatedUser,
        isLoading: false,
        logoUrl: updatedUser.avatar,
      });
    });
  },
}));
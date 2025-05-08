import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type UserMetadata = {
  full_name?: string;
  picture?: string;
};

type AuthState = {
  isSignedIn: boolean;
  isUserRegistered: boolean;
  isUserVerified: boolean;
  showCreateUserModal: boolean;
  showOtpModal: boolean;
  userName: string | null;
  userImage: string | null;
  userEmail: string | null;

  // Actions
  setIsSignedIn: (value: boolean) => void;
  setIsUserRegistered: (value: boolean) => void;
  setIsUserVerified: (value: boolean) => void;
  setShowCreateUserModal: (value: boolean) => void;
  setShowOtpModal: (value: boolean) => void;
  setUserData: (name: string | null, image: string | null, email: string | null) => void;
  setUser: (user: User | null) => void;

  checkSession: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isSignedIn: false,
  isUserRegistered: false,
  isUserVerified: false,
  showCreateUserModal: false,
  showOtpModal: false,
  userName: null,
  userImage: null,
  userEmail: null,

  setIsSignedIn: (value) => set({ isSignedIn: value }),
  setIsUserRegistered: (value) => set({ isUserRegistered: value }),
  setIsUserVerified: (value) => set({ isUserVerified: value }),
  setShowCreateUserModal: (value) => set({ showCreateUserModal: value }),
  setShowOtpModal: (value) => set({ showOtpModal: value }),

  setUserData: (name, image, email) =>
    set({
      userName: name,
      userImage: image,
      userEmail: email,
    }),

  setUser: (user) => {
    if (user) {
      const metadata = user.user_metadata as UserMetadata;
      set({
        isSignedIn: true,
        userName: metadata?.full_name || 'User',
        userImage: metadata?.picture || '/images/user.png',
        userEmail: user.email || 'No email provided',
      });
    } else {
      set({
        isSignedIn: false,
        userName: null,
        userImage: null,
        userEmail: null,
      });
    }
  },

  checkSession: async () => {
    const { isSignedIn } = get();
    if (isSignedIn) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        set({
          isSignedIn: false,
          isUserRegistered: false,
          isUserVerified: false,
          userName: null,
          userImage: null,
          userEmail: null,
        });
        return;
      }

      const user = session.user;
      const metadata = user.user_metadata as UserMetadata;

      set({
        isSignedIn: true,
        userName: metadata?.full_name || 'User',
        userImage: metadata?.picture || '/images/user.png',
        userEmail: user.email || 'No email provided',
      });

      const { data, error: userError } = await supabase
        .from('users')
        .select('id, is_verified')
        .eq('id', user.id)
        .single();

      if (userError || !data) {
        set({ isUserRegistered: false, showCreateUserModal: true });
      } else {
        set({
          isUserRegistered: true,
          isUserVerified: data.is_verified,
          showOtpModal: !data.is_verified,
        });
      }
    } catch (err) {
      console.error('checkSession error:', err);
      set({
        isSignedIn: false,
        isUserRegistered: false,
        isUserVerified: false,
      });
    }
  },

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // After OAuth, check session and user state
      await get().checkSession();
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        isSignedIn: false,
        isUserRegistered: false,
        isUserVerified: false,
        showCreateUserModal: false,
        showOtpModal: false,
        userName: null,
        userImage: null,
        userEmail: null,
      });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  },
}));
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
        id,
        full_name,
        email,
        avatar_url,
        role:role_id(role_name),
        is_active,
        storage_limit_gb,
        storage_used_gb,
        current_package,
        package_expiry_date,
        plan_started_at,
        payment_status,
        is_email_verified,
        last_login,
        signup_source,
        referral_code,
        referred_by,
        country,
        phone_number,
        organization,
        website,
        bio,
        profile_completed,
        preferred_language,
        order_number,
        price,
        created_at
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
      full_name: profileData.full_name || sessionData.user.user_metadata?.full_name || 'Unknown',
      email: profileData.email || sessionData.user.email || '',
      avatar_url: profileData.avatar_url || sessionData.user.user_metadata?.avatar_url || '',
      role: (
        profileData.role && Array.isArray(profileData.role)
          ? (profileData.role[0] as { role_name: ValidRole })
          : (profileData.role as { role_name: ValidRole } | undefined)
      ) ?? { role_name: 'user' as ValidRole },

      is_active: profileData.is_active ?? true,
      storage_limit_gb: profileData.storage_limit_gb ?? 5,
      storage_used_gb: profileData.storage_used_gb ?? 0,
      current_package: profileData.current_package ?? 'free',
      package_expiry_date: profileData.package_expiry_date ?? null,
      plan_started_at: profileData.plan_started_at ?? null,
      payment_status: profileData.payment_status ?? 'unpaid',
      is_email_verified: profileData.is_email_verified ?? false,
      last_login: profileData.last_login ?? null,
      signup_source: profileData.signup_source ?? 'google',
      referral_code: profileData.referral_code ?? null,
      referred_by: profileData.referred_by ?? null,
      country: profileData.country ?? null,
      phone_number: profileData.phone_number ?? null,
      organization: profileData.organization ?? null,
      website: profileData.website ?? null,
      bio: profileData.bio ?? null,
      profile_completed: profileData.profile_completed ?? false,
      preferred_language: profileData.preferred_language ?? 'en',
      order_number: profileData.order_number ?? 0,
      price: profileData.price ?? 0,
      created_at: profileData.created_at ?? null
    };

    set({
      user: userModel,
      isLoading: false,
      logoUrl: userModel.avatar_url ?? '',
    });

    supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session?.user) {
        console.log('[AuthStore] 👋 User signed out');
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          role:role_id(role_name),
          is_active,
          storage_limit_gb,
          storage_used_gb,
          current_package,
          package_expiry_date,
          plan_started_at,
          payment_status,
          is_email_verified,
          last_login,
          signup_source,
          referral_code,
          referred_by,
          country,
          phone_number,
          organization,
          website,
          bio,
          profile_completed,
          preferred_language,
          order_number,
          price,
          created_at
        `)
        .eq('id', session.user.id)
        .single();

      if (updateError || !updatedProfile) {
        console.warn('[AuthStore] ❌ Realtime profile fetch failed:', updateError?.message);
        set({ user: null, isLoading: false, logoUrl: '' });
        return;
      }

      const updatedUser: UserModel = {
        id: session.user.id,
        full_name: updatedProfile.full_name || session.user.user_metadata?.full_name || 'Unknown',
        email: updatedProfile.email || session.user.email || '',
        avatar_url: updatedProfile.avatar_url || session.user.user_metadata?.avatar_url || '',
        role: (
          updatedProfile.role && Array.isArray(updatedProfile.role)
            ? { role_name: updatedProfile.role[0]?.role_name as ValidRole }
            : (updatedProfile.role && typeof updatedProfile.role === 'object' && 'role_name' in updatedProfile.role)
              ? { role_name: (updatedProfile.role as { role_name: ValidRole }).role_name }
              : { role_name: 'user' as ValidRole }
        ),
        is_active: updatedProfile.is_active ?? true,
        storage_limit_gb: updatedProfile.storage_limit_gb ?? 5,
        storage_used_gb: updatedProfile.storage_used_gb ?? 0,
        current_package: updatedProfile.current_package ?? 'free',
        package_expiry_date: updatedProfile.package_expiry_date ?? null,
        plan_started_at: updatedProfile.plan_started_at ?? null,
        payment_status: updatedProfile.payment_status ?? 'unpaid',
        is_email_verified: updatedProfile.is_email_verified ?? false,
        last_login: updatedProfile.last_login ?? null,
        signup_source: updatedProfile.signup_source ?? 'google',
        referral_code: updatedProfile.referral_code ?? null,
        referred_by: updatedProfile.referred_by ?? null,
        country: updatedProfile.country ?? null,
        phone_number: updatedProfile.phone_number ?? null,
        organization: updatedProfile.organization ?? null,
        website: updatedProfile.website ?? null,
        bio: updatedProfile.bio ?? null,
        profile_completed: updatedProfile.profile_completed ?? false,
        preferred_language: updatedProfile.preferred_language ?? 'en',
        order_number: updatedProfile.order_number ?? 0,
        price: updatedProfile.price ?? 0,
        created_at: updatedProfile.created_at ?? null
      };

      set({
        user: updatedUser,
        isLoading: false,
        logoUrl: updatedUser.avatar_url ?? '',
      });
    });
  },
}));
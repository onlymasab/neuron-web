import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { UserModel } from '@/types/UserModel';
import { toast } from 'sonner';

interface ProfileStore {
  users: UserModel[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  reset: () => void;
}

const supabase = createClient();

export const useProfileStore = create<ProfileStore>((set, get) => {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  const fetchUsers = async () => {
    set({ loading: true });

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        avatar_url,
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
        created_at,
        role:role_id!inner (
          role_name
        )
      `)
      .eq('role.role_name', 'user'); // ✅ Only fetch normal users

    if (error) {
      console.error('Fetch users error:', error);
      set({ loading: false });
      toast.error('Error fetching users');
      return;
    }

    // 🧹 Ensure role is not an array
    const formattedUsers = (data as any[]).map((user) => ({
      ...user,
      role: Array.isArray(user.role) ? user.role[0] : user.role,
    }));

    set({ users: formattedUsers, loading: false });
  };

  const subscribeToUsers = () => {
    if (channel) return; // 🚫 Avoid duplicate subscriptions

    channel = supabase
      .channel('realtime-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        async () => {
          await fetchUsers(); // 🔁 Refresh on realtime change
        }
      )
      .subscribe();
  };

  const reset = () => {
    set({ users: [], loading: false });
    if (channel) {
      supabase.removeChannel(channel); // 🧹 Cleanup
      channel = null;
    }
  };

  // ✅ Only trigger once (store-level)
  fetchUsers().then(subscribeToUsers);

  return {
    users: [],
    loading: false,
    fetchUsers,
    reset,
  };
});
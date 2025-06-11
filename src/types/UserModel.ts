export type ValidRole = 'admin' | 'user' | 'editor';

export type UserModel = {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: {
    role_name: ValidRole;
  };
  is_active: boolean;
  storage_limit_gb: number;
  storage_used_gb: number;
  current_package: string;
  package_expiry_date: string | null; // ISO timestamp
  plan_started_at: string | null;
  payment_status: 'paid' | 'unpaid' | 'cancel';
  is_email_verified: boolean;
  last_login: string | null;
  signup_source: string | null;
  referral_code: string | null;
  referred_by: string | null;
  country: string | null;
  phone_number: string | null;
  organization: string | null;
  website: string | null;
  bio: string | null;
  profile_completed: boolean;
  preferred_language: string;
  price: number;

  // ✅ New field for display/indexing
  order_number: number; // Will be auto-generated (e.g., 123) and can be formatted as '000123'

  // ✅ Created timestamp from Supabase (ISO format)
  created_at: string; // or Date if you're converting it when fetching
};
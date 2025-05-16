'use client';

import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { ValidRole } from '@/types/UserModel';

declare const google: any;

interface Props {
  onUserNotFound: () => void;
}

export default function GoogleLoginButton({ onUserNotFound }: Props) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not set in environment variables');
      return;
    }

    const initializeGoogleSignIn = () => {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(document.getElementById('google-button'), {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 280,
      });
    };

    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = 'google-gsi-script';
      script.onload = initializeGoogleSignIn;
      script.onerror = () => console.error('Failed to load Google Sign-In script');
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      // Decode token to get user info (optional)
      const decoded = jwtDecode<{ email: string; name: string; picture: string }>(response.credential);
      console.log('Decoded Google token:', decoded);

      // Sign in or sign up user with Supabase
      const { error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (authError) {
        console.error('Supabase auth error:', authError.message);
        if (authError.status === 404 || authError.message.includes('User not found')) {
          onUserNotFound();
        }
        return;
      }

      // Get current authenticated user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userData?.user || userError) {
        console.error('Error getting user:', userError?.message);
        return;
      }
      const userId = userData.user.id;

      // Fetch profile joined with roles to get role_name
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, roles!inner(role_name)')
        .eq('id', userId)
        .single();

      if (fetchError || !profileData) {
        console.error('Error fetching profile:', fetchError?.message);
        return;
      }

      // Build user model for your app
      const userModel = {
        id: userId,
        name: profileData.full_name || decoded.name || 'Unknown',
        email: profileData.email || decoded.email || '',
        avatar: profileData.avatar_url || decoded.picture || '',
        role: ((profileData.roles as { role_name: string }[])?.[0]?.role_name || 'admin') as ValidRole,
      };

      // Update Zustand auth store
      useAuthStore.getState().setUser(userModel);
      useAuthStore.getState().setLogoUrl(userModel.avatar || '');

    } catch (err) {
      console.error('Error processing Google sign-in:', err);
    }
  };

  return <div id="google-button" />;
}
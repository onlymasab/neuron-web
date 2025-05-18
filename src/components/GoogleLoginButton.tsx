'use client';

import { useEffect, useRef } from 'react';
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
  const nonceRef = useRef<string | null>(null);

  const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return [nonce, hashedNonce];
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not set');
      return;
    }

    const initGoogleSignIn = async () => {
      const [generatedNonce, hashedNonce] = await generateNonce();
      nonceRef.current = generatedNonce;

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
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

    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = scriptId;
      script.onload = initGoogleSignIn;
      script.onerror = () => console.error('Failed to load Google Sign-In script');
      document.body.appendChild(script);
    } else {
      initGoogleSignIn();
    }
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      const decoded = jwtDecode<{ email: string; name: string; picture: string }>(response.credential);
      console.log('Decoded Google token:', decoded);

      const nonce = nonceRef.current;
      if (!nonce) {
        console.error('Nonce is missing');
        return;
      }

      const { error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce,
      });

      if (authError) {
        console.error('Supabase auth error:', authError.message);
        if (authError.status === 404 || authError.message.includes('User not found')) {
          onUserNotFound();
        }
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userData?.user || userError) {
        console.error('Error getting user:', userError?.message);
        return;
      }

      const userId = userData.user.id;
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, role_id(role_name)')
        .eq('id', userId)
        .single();

      if (fetchError || !profileData) {
        console.error('Error fetching profile:', fetchError?.message);
        return;
      }

      const userModel = {
        id: userId,
        name: profileData.full_name || decoded.name || 'Unknown',
        email: profileData.email || decoded.email || '',
        avatar: profileData.avatar_url || decoded.picture || '',
        role: profileData.role_id[0]?.role_name
        
      };

   

     

      useAuthStore.getState().setUser(userModel);
      useAuthStore.getState().setLogoUrl(userModel.avatar || '');
    } catch (err) {
      console.error('Error processing Google sign-in:', err);
    }
  };

  return <div id="google-button" />;
}
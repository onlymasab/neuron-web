'use client';

import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';

declare const google: any;

interface Props {
  onUserNotFound: () => void;
}

export default function GoogleLoginButton({ onUserNotFound }: Props) {
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

    // Load the Google Sign-In script only once
    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = 'google-gsi-script';
      script.onload = initializeGoogleSignIn;
      script.onerror = () => console.error('Failed to load Google Sign-In script');
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script); // Cleanup script after component unmounts
      };
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      const decoded = jwtDecode<{ email: string; name: string }>(response.credential);
      console.log('Decoded Google token:', decoded);

      // Sign in user with the received token from Google
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error('Supabase auth error:', error.message);
        if (error.status === 404 || error.message.includes('User not found')) {
          onUserNotFound(); // Call the callback if the user is not found
        }
      } else {
        // User signed in successfully, set user data in state
        const { data } = await supabase.auth.getUser();
        useAuthStore.getState().setUser(data?.user ?? null);
        console.log('User authenticated successfully');
      }
    } catch (err) {
      console.error('Error processing Google sign-in:', err);
    }
  };

  return <div id="google-button" />;
}
'use client';

import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import  {supabase}  from '@/lib/supabase/client';

declare const google: any;

interface Props {
  onUserNotFound: () => void;
}

export default function GoogleLoginButton({ onUserNotFound }: Props) {
  useEffect(() => {
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

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    const decoded = jwtDecode(response.credential) as any;
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
      options: {},
    });

    if (error) {
      console.error('Supabase auth error:', error.message);
      if (error.status === 404 || error.message.includes('User not found')) {
        onUserNotFound();
      }
    } else {
      console.log('User authenticated successfully');
    }
  };

  return <div id="google-button" />;
}
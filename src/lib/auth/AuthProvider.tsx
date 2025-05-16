'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Run only on client side to check auth on initial load
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [checkAuth]);

  return <>{children}</>;
}
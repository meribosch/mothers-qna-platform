'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error.message);
        router.push('/auth/login');
        return;
      }

      if (user) {
        setUser(user);
        
        // If email is verified, redirect to home, otherwise to verify page
        if (user.email_confirmed_at) {
          router.push('/home');
        } else {
          router.push('/auth/verify');
        }
      } else {
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Processing authentication...</h2>
        <p className="mt-2 text-sm text-gray-600">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
} 
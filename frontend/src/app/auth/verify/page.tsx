'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';

export default function VerifyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // If email already verified, redirect to home
    if (user.email_confirmed_at) {
      router.push('/home');
    }
  }, [user, router]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setMessage(null);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email!,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Verification email has been resent. Please check your inbox.',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to resend verification email.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!user) return null;

  return (
    <PublicLayout showAuthLinks={false}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify your email
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            We sent a verification email to{' '}
            <span className="font-medium text-indigo-600">{user.email}</span>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {message && (
                <div
                  className={`rounded-md p-4 ${
                    message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div
                    className={`text-sm ${
                      message.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>
                  Please check your email and click the verification link to complete your registration.
                  If you don't see the email, check your spam folder.
                </p>
              </div>

              <div>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>

              <div className="text-sm text-center">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Return to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
} 
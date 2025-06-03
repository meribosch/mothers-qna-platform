'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          useAuthStore.setState({ user: session.user, isLoading: false });
        } else {
          useAuthStore.setState({ user: null, isLoading: false });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Questions', href: '/questions' },
  ];

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  {/* Logo */}
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                      Mothers Help
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                            isActive
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {isLoading ? (
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : user ? (
                    <button
                      onClick={() => useAuthStore.getState().signOut()}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Sign out
                    </button>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/auth/signin"
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

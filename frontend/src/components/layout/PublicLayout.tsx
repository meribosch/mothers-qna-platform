'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface PublicLayoutProps {
  children: ReactNode;
  showAuthLinks?: boolean;
}

export function PublicLayout({ children, showAuthLinks = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showAuthLinks && (
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                MomsHelp
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
} 
'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <MainLayout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Welcome back, {user?.user_metadata?.name || 'there'}!
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Questions Feed */}
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No questions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by asking your first question
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/questions/ask"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <span>Ask a Question</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
} 
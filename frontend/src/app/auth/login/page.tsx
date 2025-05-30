'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </MainLayout>
  );
} 
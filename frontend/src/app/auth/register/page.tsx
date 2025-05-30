'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </MainLayout>
  );
} 
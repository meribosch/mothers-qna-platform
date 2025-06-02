'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionForm } from '@/components/questions/QuestionForm';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

export default function AskQuestionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/questions/ask');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    // TODO: Implement API call to create question
    console.log('Creating question:', data);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Sign in to ask a question</h2>
            <p className="mt-1 text-sm text-gray-500">
              Please{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                sign in
              </Link>{' '}
              or{' '}
              <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                register
              </Link>{' '}
              to ask a question.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
          <p className="mt-2 text-sm text-gray-600">
            Get help and advice from experienced mothers in our community
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg bg-white p-6 shadow">
            <QuestionForm onSubmit={handleSubmit} />
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <h2 className="text-lg font-medium text-blue-800">Writing a good question</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-700">
              <li>Be specific about your situation and what you've tried</li>
              <li>Include relevant details about your baby's age and development</li>
              <li>Keep it focused on one main question</li>
              <li>Use clear, simple language</li>
              <li>Check if similar questions have been asked before</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
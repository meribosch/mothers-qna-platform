'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionForm } from '@/components/questions/QuestionForm';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

// TODO: Replace with API call
const MOCK_QUESTION = {
  id: '1',
  title: 'How often should I feed my newborn?',
  content:
    'My baby is 2 weeks old and I\'m wondering about the feeding schedule. Should I feed on demand or try to establish a routine?\n\nI\'ve heard different advice from different sources, and I\'m not sure what\'s best. Some say to feed every 2-3 hours, others say to feed whenever the baby shows hunger cues.\n\nWhat worked for you? Any tips for recognizing hunger cues versus other types of crying?',
  tags: ['feeding', 'newborn', 'schedule'],
  author: {
    id: '123',
    name: 'Sarah Johnson',
  },
};

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [question, setQuestion] = useState<typeof MOCK_QUESTION | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // TODO: Replace with actual API call
        setQuestion(MOCK_QUESTION);
      } catch (error) {
        setError('Failed to load question');
      } finally {
        setIsLoadingQuestion(false);
      }
    };

    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/questions/' + params.id + '/edit');
      return;
    }

    if (!isLoading && user && question && user.id !== question.author.id) {
      router.push('/questions/' + params.id);
      return;
    }
  }, [user, isLoading, router, question, params.id]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      // TODO: Implement API call to update question
      console.log('Updating question:', data);
      router.push('/questions/' + params.id);
    } catch (error: any) {
      setError(error.message || 'Failed to update question');
    }
  };

  if (isLoading || isLoadingQuestion) {
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
            <h2 className="text-lg font-medium text-gray-900">Sign in to edit your question</h2>
            <p className="mt-1 text-sm text-gray-500">
              Please{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                sign in
              </Link>{' '}
              to continue.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Error</h2>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Link
                href={'/questions/' + params.id}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to question
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!question) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Question not found</h2>
            <p className="mt-1 text-sm text-gray-500">
              The question you're trying to edit doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link href="/questions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Back to questions
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (user.id !== question.author.id) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Not authorized</h2>
            <p className="mt-1 text-sm text-gray-500">
              You don't have permission to edit this question.
            </p>
            <div className="mt-4">
              <Link
                href={'/questions/' + params.id}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to question
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Question</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your question to make it clearer or add more details
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg bg-white p-6 shadow">
            <QuestionForm
              onSubmit={handleSubmit}
              initialData={{
                title: question.title,
                content: question.content,
                tags: question.tags,
              }}
              isEditing
            />
          </div>

          <div className="mt-6 rounded-lg bg-yellow-50 p-4">
            <h2 className="text-lg font-medium text-yellow-800">Editing guidelines</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-700">
              <li>Keep the original meaning of the question intact</li>
              <li>Fix any typos or grammatical errors</li>
              <li>Add relevant details that were missing</li>
              <li>Update tags if needed</li>
              <li>Remove any sensitive personal information</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
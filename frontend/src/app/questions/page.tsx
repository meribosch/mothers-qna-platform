'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { TagFilter } from '@/components/questions/TagFilter';
import Link from 'next/link';

// TODO: Replace with actual API call
const MOCK_QUESTIONS = [
  {
    id: '1',
    title: 'How often should I feed my newborn?',
    content: 'My baby is 2 weeks old and I\'m wondering about the feeding schedule. Should I feed on demand or try to establish a routine?',
    createdAt: '2024-03-10T10:00:00Z',
    author: {
      name: 'Sarah Johnson',
    },
    tags: ['feeding', 'newborn', 'schedule'],
    answersCount: 5,
    votes: 12,
  },
  {
    id: '2',
    title: 'Normal sleep patterns for a 3-month-old',
    content: 'My 3-month-old baby\'s sleep patterns seem irregular. Is this normal? How many hours should they be sleeping?',
    createdAt: '2024-03-09T15:30:00Z',
    author: {
      name: 'Emily Chen',
    },
    tags: ['sleep', 'development', '3-months'],
    answersCount: 8,
    votes: 15,
  },
];

const SORT_OPTIONS = [
  { label: 'Most recent', value: 'recent' },
  { label: 'Most votes', value: 'votes' },
  { label: 'Most answers', value: 'answers' },
];

export default function QuestionsPage() {
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // TODO: Replace with actual API data and filtering
  const questions = MOCK_QUESTIONS.filter((question) =>
    selectedTags.length === 0 ? true : selectedTags.some((tag) => question.tags.includes(tag))
  );

  return (
    <MainLayout>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Questions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse questions from the community or ask your own
            </p>
          </div>
          <Link
            href="/questions/ask"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Ask Question
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-medium text-gray-900">Filter by tags</h2>
              <div className="mt-4">
                <TagFilter selectedTags={selectedTags} onTagsChange={setSelectedTags} />
              </div>
            </div>
          </div>

          {/* Questions list */}
          <div className="lg:col-span-3">
            {/* Sort options */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-500">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </div>
            </div>

            {/* Questions */}
            <div className="divide-y divide-gray-200">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>

            {/* Empty state */}
            {questions.length === 0 && (
              <div className="mt-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedTags.length > 0
                    ? 'Try removing some filters or ask a new question'
                    : 'Be the first to ask a question!'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/questions/ask"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Ask Question
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
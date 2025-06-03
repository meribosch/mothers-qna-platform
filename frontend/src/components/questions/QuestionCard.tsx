'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Database } from '@/lib/database.types';

type Question = Database['public']['Tables']['momsquestions']['Row'] & {
  user: {
    email: string;
    user_metadata: {
      name?: string;
    };
  };
  answers: { count: number };
  question_tags: {
    tags: {
      name: string;
    };
  }[];
};

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const authorName = question.user?.user_metadata?.name || question.user?.email?.split('@')[0] || 'Anonymous';
  const answersCount = question.answers?.count || 0;
  const tags = question.question_tags?.map(qt => qt.tags.name) || [];

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            href={`/questions/${question.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
          >
            {question.content.length > 150 
              ? `${question.content.substring(0, 150)}...` 
              : question.content}
          </Link>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>Asked by {authorName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
            <span>•</span>
            <span>{answersCount} {answersCount === 1 ? 'answer' : 'answers'}</span>
          </div>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
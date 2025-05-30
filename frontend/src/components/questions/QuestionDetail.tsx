import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

interface QuestionDetailProps {
  question: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    tags: string[];
    votes: number;
  };
  onVote: (type: 'up' | 'down') => void;
}

export function QuestionDetail({ question, onVote }: QuestionDetailProps) {
  const { user } = useAuthStore();
  const [isReporting, setIsReporting] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    try {
      // TODO: Implement report functionality
    } catch (error) {
      console.error('Failed to report question:', error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex gap-6">
        {/* Voting */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onVote('up')}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
            disabled={!user}
            title={user ? 'Vote up' : 'Sign in to vote'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-900">{question.votes}</span>
          <button
            onClick={() => onVote('down')}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
            disabled={!user}
            title={user ? 'Vote down' : 'Sign in to vote'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Asked {formatDate(question.createdAt)}</span>
            <span>by {question.author.name}</span>
          </div>

          {/* Question content */}
          <div className="prose prose-indigo mt-6 max-w-none">
            <p className="whitespace-pre-wrap">{question.content}</p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex gap-2">
            {question.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-4 border-t border-gray-200 pt-4">
            {user && user.id !== question.author.id && (
              <button
                onClick={handleReport}
                disabled={isReporting}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {isReporting ? 'Reporting...' : 'Report'}
              </button>
            )}
            {user && user.id === question.author.id && (
              <>
                <Link
                  href={`/questions/${question.id}/edit`}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Edit
                </Link>
                <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
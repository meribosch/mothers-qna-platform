import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  votes: number;
  isAccepted: boolean;
}

interface AnswersListProps {
  questionId: string;
  answers: Answer[];
  onVoteAnswer: (answerId: string, type: 'up' | 'down') => void;
  onAcceptAnswer?: (answerId: string) => void;
  onAddAnswer: (content: string) => void;
  isAuthor?: boolean;
}

export function AnswersList({
  questionId,
  answers,
  onVoteAnswer,
  onAcceptAnswer,
  onAddAnswer,
  isAuthor,
}: AnswersListProps) {
  const { user } = useAuthStore();
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddAnswer(newAnswer);
      setNewAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">
        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
      </h2>

      {/* Answers list */}
      <div className="mt-4 space-y-6">
        {answers.map((answer) => (
          <div key={answer.id} className="border-t border-gray-200 pt-6">
            <div className="flex gap-6">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => onVoteAnswer(answer.id, 'up')}
                  className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                  disabled={!user}
                  title={user ? 'Vote up' : 'Sign in to vote'}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-lg font-medium text-gray-900">{answer.votes}</span>
                <button
                  onClick={() => onVoteAnswer(answer.id, 'down')}
                  className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                  disabled={!user}
                  title={user ? 'Vote down' : 'Sign in to vote'}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAuthor && (
                  <button
                    onClick={() => onAcceptAnswer?.(answer.id)}
                    className={`mt-2 p-2 ${
                      answer.isAccepted
                        ? 'text-green-600'
                        : 'text-gray-500 hover:text-green-600'
                    }`}
                    title="Accept this answer"
                  >
                    <svg
                      className="h-6 w-6"
                      fill={answer.isAccepted ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="prose prose-indigo max-w-none">
                  <p className="whitespace-pre-wrap">{answer.content}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {answer.author.avatar ? (
                      <img
                        src={answer.author.avatar}
                        alt={answer.author.name}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-700">
                          {answer.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-600">{answer.author.name}</span>
                  </div>
                  <span className="text-gray-500">answered {formatDate(answer.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-8">
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              Your Answer
            </label>
            <div className="mt-2">
              <textarea
                id="answer"
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write your answer here..."
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting || !newAnswer.trim()}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            Please{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in
            </Link>{' '}
            or{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              register
            </Link>{' '}
            to answer this question.
          </p>
        </div>
      )}
    </div>
  );
} 
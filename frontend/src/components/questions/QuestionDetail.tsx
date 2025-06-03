'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/auth.store';
import { questionsApi } from '@/lib/api/questions';
import { answersApi } from '@/lib/api/answers';
import { Database } from '@/lib/database.types';

type Answer = Database['public']['Tables']['answers']['Row'] & {
  user: {
    email: string;
    user_metadata: {
      name?: string;
    };
  };
};

type QuestionWithAnswers = Database['public']['Tables']['momsquestions']['Row'] & {
  user: {
    email: string;
    user_metadata: {
      name?: string;
    };
  };
  answers: Answer[];
  question_tags: {
    tags: {
      name: string;
    };
  }[];
};

interface QuestionDetailProps {
  questionId: number;
}

export function QuestionDetail({ questionId }: QuestionDetailProps) {
  const { user } = useAuthStore();
  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await questionsApi.getQuestionById(questionId);
        setQuestion(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load question');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAnswer.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const answer = await answersApi.createAnswer({
        question_id: questionId,
        user_id: user.id,
        content: newAnswer.trim(),
      });

      // Fetch the user data for the new answer
      const answerWithUser: Answer = {
        ...answer,
        user: {
          email: user.email || '',
          user_metadata: {
            name: user.user_metadata?.name,
          },
        },
      };

      setQuestion((prev) => 
        prev ? { ...prev, answers: [...prev.answers, answerWithUser] } : null
      );
      setNewAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    if (!user) return;

    try {
      const updatedAnswer = await answersApi.acceptAnswer(answerId);
      setQuestion((prev) => {
        if (!prev) return null;
        const updatedAnswers = prev.answers.map((answer) => ({
          ...answer,
          is_accepted: answer.id === updatedAnswer.id ? true : false,
        }));
        return { ...prev, answers: updatedAnswers };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept answer');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-semibold text-gray-900">Question not found</h3>
      </div>
    );
  }

  const authorName = question.user?.user_metadata?.name || question.user?.email?.split('@')[0] || 'Anonymous';
  const tags = question.question_tags?.map(qt => qt.tags.name) || [];

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div className="text-lg text-gray-900">{question.content}</div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Asked by {authorName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        {question.answers.map((answer) => {
          const answerAuthorName = answer.user?.user_metadata?.name || answer.user?.email?.split('@')[0] || 'Anonymous';
          const isQuestionAuthor = question.user_id === user?.id;
          const canAcceptAnswer = isQuestionAuthor && !answer.is_accepted;

          return (
            <div
              key={answer.id}
              className={`bg-white shadow rounded-lg p-6 ${
                answer.is_accepted ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="text-gray-900">{answer.content}</div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Answered by {answerAuthorName}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {canAcceptAnswer && (
                    <button
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Accept Answer
                    </button>
                  )}

                  {answer.is_accepted && (
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full text-green-700 bg-green-100">
                      Accepted Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Answer Form */}
        {user && (
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                Your Answer
              </label>
              <div className="mt-1">
                <textarea
                  id="answer"
                  name="answer"
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Share your knowledge or experience..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newAnswer.trim()}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Answer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 
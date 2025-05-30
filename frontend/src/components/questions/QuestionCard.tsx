import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      avatar?: string;
    };
    tags: string[];
    answersCount: number;
    votes: number;
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="flex gap-4 py-6">
      {/* Stats */}
      <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <span className="font-medium">{question.votes}</span>
          <span>votes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">{question.answersCount}</span>
          <span>answers</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">
          <Link href={`/questions/${question.id}`} className="hover:text-indigo-600">
            {question.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{question.content}</p>
        
        {/* Tags */}
        <div className="mt-4 flex gap-2">
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

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {question.author.avatar ? (
              <img
                src={question.author.avatar}
                alt={question.author.name}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-medium text-indigo-700">
                  {question.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-gray-600">{question.author.name}</span>
          </div>
          <span className="text-gray-500">asked {formatDate(question.createdAt)}</span>
        </div>
      </div>
    </div>
  );
} 
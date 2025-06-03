import { QuestionList } from '@/components/questions/QuestionList';
import { QuestionForm } from '@/components/questions/QuestionForm';

export default function QuestionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ask questions about newborn care and get answers from experienced mothers
          </p>
        </div>

        <QuestionForm />
        <QuestionList />
      </div>
    </div>
  );
} 
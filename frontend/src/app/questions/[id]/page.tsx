'use client';

import { useParams } from 'next/navigation';
import { QuestionDetail } from '@/components/questions/QuestionDetail';

export default function QuestionPage() {
  const params = useParams();
  const questionId = Number(params.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <QuestionDetail questionId={questionId} />
    </div>
  );
} 
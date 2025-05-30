'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuestionDetail } from '@/components/questions/QuestionDetail';
import { AnswersList } from '@/components/questions/AnswersList';
import { useAuthStore } from '@/stores/auth.store';

// TODO: Replace with API data
const MOCK_QUESTION = {
  id: '1',
  title: 'How often should I feed my newborn?',
  content:
    'My baby is 2 weeks old and I\'m wondering about the feeding schedule. Should I feed on demand or try to establish a routine?\n\nI\'ve heard different advice from different sources, and I\'m not sure what\'s best. Some say to feed every 2-3 hours, others say to feed whenever the baby shows hunger cues.\n\nWhat worked for you? Any tips for recognizing hunger cues versus other types of crying?',
  createdAt: '2024-03-10T10:00:00Z',
  author: {
    id: '123',
    name: 'Sarah Johnson',
  },
  tags: ['feeding', 'newborn', 'schedule'],
  votes: 12,
};

const MOCK_ANSWERS = [
  {
    id: '1',
    content:
      'For newborns, it\'s generally recommended to feed on demand. This means watching for hunger cues rather than sticking to a strict schedule. Common hunger cues include:\n\n- Rooting (turning head and opening mouth)\n- Putting hands to mouth\n- Making sucking motions\n- Fussing and squirming\n\nDon\'t wait until your baby is crying - that\'s a late sign of hunger. In the early weeks, most babies need to feed 8-12 times per day (every 2-3 hours).',
    createdAt: '2024-03-10T11:30:00Z',
    author: {
      id: '456',
      name: 'Dr. Emily Chen',
    },
    votes: 15,
    isAccepted: true,
  },
  {
    id: '2',
    content:
      'I went through this with my newborn too! I found that trying to force a schedule in the early weeks was really stressful for both me and the baby. Following their cues worked much better.\n\nOne tip that helped me: keep a simple log of feeding times for the first few weeks. This helped me recognize patterns without trying to force them.',
    createdAt: '2024-03-10T12:45:00Z',
    author: {
      id: '789',
      name: 'Maria Garcia',
    },
    votes: 8,
    isAccepted: false,
  },
];

export default function QuestionPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const [question, setQuestion] = useState(MOCK_QUESTION);
  const [answers, setAnswers] = useState(MOCK_ANSWERS);

  // TODO: Replace with API calls
  const handleQuestionVote = async (type: 'up' | 'down') => {
    console.log('Vote question:', type);
  };

  const handleAnswerVote = async (answerId: string, type: 'up' | 'down') => {
    console.log('Vote answer:', answerId, type);
  };

  const handleAcceptAnswer = async (answerId: string) => {
    console.log('Accept answer:', answerId);
  };

  const handleAddAnswer = async (content: string) => {
    console.log('Add answer:', content);
  };

  return (
    <MainLayout>
      <div className="py-8">
        <QuestionDetail question={question} onVote={handleQuestionVote} />
        
        <div className="mt-8 border-t border-gray-200">
          <AnswersList
            questionId={question.id}
            answers={answers}
            onVoteAnswer={handleAnswerVote}
            onAcceptAnswer={user?.id === question.author.id ? handleAcceptAnswer : undefined}
            onAddAnswer={handleAddAnswer}
            isAuthor={user?.id === question.author.id}
          />
        </div>
      </div>
    </MainLayout>
  );
} 
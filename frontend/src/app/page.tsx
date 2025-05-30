'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Support for every step of your motherhood journey
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our community of mothers helping mothers. Get answers to your questions, share your experiences,
              and connect with other moms who understand what you're going through.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/questions"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse Questions
              </Link>
              <Link href="/questions/ask" className="text-sm font-semibold leading-6 text-gray-900">
                Ask a Question <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Get Support</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to know about newborn care
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Browse through our most popular categories or search for specific topics.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Feeding',
                  description:
                    'Get advice on breastfeeding, bottle feeding, and introducing solid foods.',
                  icon: '🍼',
                },
                {
                  name: 'Sleep',
                  description:
                    'Learn about sleep schedules, bedtime routines, and sleep training methods.',
                  icon: '😴',
                },
                {
                  name: 'Health & Safety',
                  description:
                    'Find information about common health concerns, vaccinations, and baby-proofing.',
                  icon: '🏥',
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-2xl mb-2">{feature.icon}</dt>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <Link href={`/tags/${feature.name.toLowerCase()}`} className="text-sm font-semibold leading-6 text-indigo-600">
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

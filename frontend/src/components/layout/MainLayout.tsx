import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Questions', href: '/questions' },
    { name: 'Tags', href: '/tags' },
    { name: 'Users', href: '/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  MomsHelp
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/questions/ask"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Ask Question
                  </Link>
                  <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-700">
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-gray-500 hover:text-gray-700">
                    Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Social</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MomsHelp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
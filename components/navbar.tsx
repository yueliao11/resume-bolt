'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useLanguage } from '@/lib/language-context';
import { Scissors, History } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Resume Tailor
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resume Tailor
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    {t('nav.history')}
                  </Button>
                </Link>
              </>
            )}
            <LanguageSelector />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
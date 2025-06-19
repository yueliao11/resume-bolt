import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resume Tailor - AI-Powered Resume Optimization',
  description: 'Transform your resume with AI-powered optimization for every job application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
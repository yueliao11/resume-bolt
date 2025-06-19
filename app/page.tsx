'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { FadeIn } from '@/components/ui/fade-in';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useLanguage } from '@/lib/language-context';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { 
  Upload, 
  Target, 
  Sparkles, 
  Download, 
  Star,
  Zap,
  Globe,
  Clock,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 键盘快捷键
  useKeyboardShortcuts([
    {
      key: 'g',
      callback: () => {
        const element = document.getElementById('get-started');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ]);

  const features = [
    {
      icon: Upload,
      title: t('features.upload'),
      step: '01'
    },
    {
      icon: Target,
      title: t('features.paste'),
      step: '02'
    },
    {
      icon: Sparkles,
      title: t('features.optimize'),
      step: '03'
    },
    {
      icon: Download,
      title: t('features.download'),
      step: '04'
    }
  ];

  const productFeatures = [
    {
      icon: Zap,
      title: t('features.aiOptimization'),
      description: t('features.aiOptimizationDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: t('features.multiLanguage'),
      description: t('features.multiLanguageDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: t('features.instantResults'),
      description: t('features.instantResultsDesc'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: '+',
      label: 'Active Users'
    },
    {
      icon: TrendingUp,
      value: 95,
      suffix: '%',
      label: 'Success Rate'
    },
    {
      icon: Shield,
      value: 100,
      suffix: '%',
      label: 'Secure & Private'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: "Resume Tailor helped me land my dream job! The AI optimization made my resume stand out to recruiters.",
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Manager at Microsoft',
      content: "I've tried many resume tools, but this one actually understands what employers are looking for. Highly recommended!",
      rating: 5,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      name: 'Yuki Tanaka',
      role: 'Data Scientist at Toyota',
      content: "The multilingual support is amazing. I was able to optimize my resume for both local and international opportunities.",
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  const faqs = [
    {
      question: 'How does AI resume optimization work?',
      answer: 'Our AI analyzes your resume and the target job description, then intelligently rewrites and restructures your content to maximize keyword matching and relevance while maintaining authenticity.'
    },
    {
      question: 'Is my resume data secure?',
      answer: 'Yes, we use enterprise-grade security measures. Your data is encrypted and never shared with third parties. You can delete your data at any time.'
    },
    {
      question: 'How long does the optimization take?',
      answer: 'Most optimizations complete within 1-2 minutes. Complex resumes or detailed job descriptions may take up to 3 minutes.'
    },
    {
      question: 'Can I optimize for multiple jobs?',
      answer: 'Absolutely! You can create unlimited optimizations. Each optimization is tailored specifically to the job description you provide.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support PDF, DOC, and DOCX formats for upload. You can download your optimized resume in PDF or Word format.'
    }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className="text-center">
              <FadeIn>
                <Badge variant="outline" className="mb-4 text-purple-300 border-purple-300">
                  ✨ AI-Powered Resume Optimization
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                  {t('hero.title')}
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {t('hero.subtitle')}
                  </span>
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                  {t('hero.description')}
                </p>
                <Link href="/dashboard" id="get-started">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200">
                    {t('hero.getStarted')}
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeIn key={index} delay={index * 0.1}>
                    <Card className="bg-slate-800/50 border-slate-700 text-center">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          <AnimatedCounter 
                            value={stat.value} 
                            suffix={stat.suffix}
                          />
                        </h3>
                        <p className="text-slate-300">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('features.title')}
                </h2>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <FadeIn key={index} delay={index * 0.1}>
                    <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900">
                            {feature.step}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('features.section')}
                </h2>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <FadeIn key={index} delay={index * 0.1}>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 h-full group">
                      <CardContent className="p-8">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('testimonials.title')}
                </h2>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <Card className="bg-slate-700/50 border-slate-600 h-full hover:bg-slate-700/70 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 mb-4 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            {testimonial.name}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('faq.title')}
                </h2>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-slate-800/50 border-slate-700 rounded-lg px-6 hover:bg-slate-800/70 transition-colors duration-300"
                  >
                    <AccordionTrigger className="text-white hover:text-purple-300">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Resume?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of professionals who have already optimized their resumes with AI
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200">
                  Start Optimizing Now
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-slate-400">
                {t('footer.copyright')}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Press 'G' to quickly navigate to Get Started
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
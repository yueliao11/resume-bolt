'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/lib/language-context';
import { 
  Upload, 
  Target, 
  Sparkles, 
  Download, 
  Star,
  Zap,
  Globe,
  Clock,
  ChevronDown
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

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: "Resume Tailor helped me land my dream job! The AI optimization made my resume stand out to recruiters.",
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Manager at Microsoft',
      content: "I've tried many resume tools, but this one actually understands what employers are looking for. Highly recommended!",
      rating: 5
    },
    {
      name: 'Yuki Tanaka',
      role: 'Data Scientist at Toyota',
      content: "The multilingual support is amazing. I was able to optimize my resume for both local and international opportunities.",
      rating: 5
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
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
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
                  {t('hero.getStarted')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('features.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('features.section')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 h-full">
                    <CardContent className="p-8">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('testimonials.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-slate-700/50 border-slate-600 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="text-white font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('faq.title')}
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-slate-800/50 border-slate-700 rounded-lg px-6"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
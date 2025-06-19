'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/navbar';
import { FadeIn } from '@/components/ui/fade-in';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLanguage } from '@/lib/language-context';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { ResumeUpload } from '@/components/resume-upload';
import { JobDescriptionInput } from '@/components/job-description-input';
import { OptimizationResults } from '@/components/optimization-results';
import { useOptimization } from '@/lib/hooks/useOptimization';
import { ResumeData, OptimizationResult, Step, StepConfig } from '@/lib/types';
import { 
  Upload, 
  Target, 
  Sparkles, 
  Download,
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { t } = useLanguage();
  const { optimizeResume, isOptimizing } = useOptimization();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizationData, setOptimizationData] = useState<OptimizationResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 键盘快捷键
  useKeyboardShortcuts([
    {
      key: 'ArrowLeft',
      callback: () => {
        const steps: Step[] = ['upload', 'job', 'optimize', 'results'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
          setCurrentStep(steps[currentIndex - 1]);
        }
      }
    },
    {
      key: 'ArrowRight',
      callback: () => {
        const steps: Step[] = ['upload', 'job', 'optimize', 'results'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1 && canProceedToNextStep()) {
          setCurrentStep(steps[currentIndex + 1]);
        }
      }
    }
  ]);

  const steps: StepConfig[] = [
    {
      id: 'upload',
      title: t('dashboard.uploadResume'),
      description: t('dashboard.uploadDesc'),
      icon: Upload,
      completed: resumeData !== null
    },
    {
      id: 'job',
      title: t('dashboard.jobAnalysis'),
      description: t('dashboard.jobAnalysisDesc'),
      icon: Target,
      completed: jobDescription !== ''
    },
    {
      id: 'optimize',
      title: t('dashboard.aiOptimization'),
      description: t('dashboard.aiOptimizationDesc'),
      icon: Sparkles,
      completed: optimizationData !== null
    },
    {
      id: 'results',
      title: t('dashboard.downloadResume'),
      description: t('dashboard.downloadDesc'),
      icon: Download,
      completed: false
    }
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'upload':
        return resumeData !== null;
      case 'job':
        return jobDescription !== '';
      case 'optimize':
        return optimizationData !== null;
      default:
        return false;
    }
  };

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('job');
  };

  const handleJobDescription = (description: string) => {
    setJobDescription(description);
    setCurrentStep('optimize');
  };

  const handleOptimizationComplete = (data: OptimizationResult) => {
    setOptimizationData(data);
    setCurrentStep('results');
  };

  const handleCreateNew = () => {
    setCurrentStep('upload');
    setResumeData(null);
    setJobDescription('');
    setOptimizationData(null);
  };

  const renderStepContent = () => {
    const stepVariants = {
      enter: { opacity: 0, x: 50 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    switch (currentStep) {
      case 'upload':
        return (
          <motion.div
            key="upload"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ResumeUpload onUpload={handleResumeUpload} />
          </motion.div>
        );
      case 'job':
        return (
          <motion.div
            key="job"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <JobDescriptionInput onSubmit={handleJobDescription} />
          </motion.div>
        );
      case 'optimize':
        return (
          <motion.div
            key="optimize"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Optimizing Your Resume...</h3>
            <p className="text-slate-300 mb-4">Our AI is analyzing and tailoring your resume for the target position.</p>
            <Progress value={75} className="w-64 mx-auto" />
          </motion.div>
        );
      case 'results':
        return optimizationData ? (
          <motion.div
            key="results"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <OptimizationResults 
              data={optimizationData} 
              onCreateNew={handleCreateNew}
            />
          </motion.div>
        ) : null;
      default:
        return null;
    }
  };

  // 优化流程处理
  useEffect(() => {
    if (currentStep === 'optimize' && resumeData && jobDescription && !isOptimizing) {
      const performOptimization = async () => {
        const result = await optimizeResume(resumeData, jobDescription);
        if (result) {
          handleOptimizationComplete(result);
        }
      };
      
      performOptimization();
    }
  }, [currentStep, resumeData, jobDescription, isOptimizing, optimizeResume]);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-purple-400 mx-auto mb-4" />
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t('dashboard.welcome')}, {user?.firstName || 'there'}! 👋
              </h1>
              <p className="text-slate-300">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </FadeIn>

          {/* Progress Steps */}
          <FadeIn delay={0.1}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = step.completed;
                  const isPast = index < currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center flex-1">
                      <motion.div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 cursor-pointer
                          ${isActive ? 'bg-purple-600 ring-4 ring-purple-600/30 scale-110' : 
                            isCompleted || isPast ? 'bg-green-600' : 'bg-slate-700'}
                        `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (isCompleted || isPast || isActive) {
                            setCurrentStep(step.id);
                          }
                        }}
                      >
                        {isCompleted || isPast ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Progress value={progress} className="w-full" />
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const steps: Step[] = ['upload', 'job', 'optimize', 'results'];
                    const currentIndex = steps.indexOf(currentStep);
                    if (currentIndex > 0) {
                      setCurrentStep(steps[currentIndex - 1]);
                    }
                  }}
                  disabled={currentStepIndex === 0}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={() => {
                    const steps: Step[] = ['upload', 'job', 'optimize', 'results'];
                    const currentIndex = steps.indexOf(currentStep);
                    if (currentIndex < steps.length - 1 && canProceedToNextStep()) {
                      setCurrentStep(steps[currentIndex + 1]);
                    }
                  }}
                  disabled={!canProceedToNextStep() || currentStepIndex === steps.length - 1}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Keyboard Shortcuts Help */}
          <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs text-slate-400 border border-slate-700">
            <p>Use ← → arrow keys to navigate steps</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
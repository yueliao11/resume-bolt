'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/lib/language-context';
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
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    switch (currentStep) {
      case 'upload':
        return <ResumeUpload onUpload={handleResumeUpload} />;
      case 'job':
        return <JobDescriptionInput onSubmit={handleJobDescription} />;
      case 'optimize':
        return (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Optimizing Your Resume...</h3>
            <p className="text-slate-300 mb-4">Our AI is analyzing and tailoring your resume for the target position.</p>
            <Progress value={75} className="w-64 mx-auto" />
          </div>
        );
      case 'results':
        return optimizationData ? (
          <OptimizationResults 
            data={optimizationData} 
            onCreateNew={handleCreateNew}
          />
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t('dashboard.welcome')}, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-slate-300">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${isActive ? 'bg-purple-600 ring-4 ring-purple-600/30' : 
                      isCompleted || isPast ? 'bg-green-600' : 'bg-slate-700'}
                  `}>
                    {isCompleted || isPast ? (
                      <Check className="h-6 w-6 text-white" />
                    ) : (
                      <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </div>
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
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderStepContent()}
        </motion.div>
      </div>
    </div>
  );
}
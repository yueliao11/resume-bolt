'use client';

import { useState, useCallback } from 'react';
import { ResumeData, OptimizationResult, JobAnalysis } from '@/lib/types';
import { validateJobDescription } from '@/lib/utils';

interface UseOptimizationReturn {
  isOptimizing: boolean;
  error: string | null;
  optimizeResume: (resumeData: ResumeData, jobDescription: string) => Promise<OptimizationResult | null>;
  analyzeJobDescription: (description: string) => JobAnalysis | null;
  clearError: () => void;
}

export function useOptimization(): UseOptimizationReturn {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const analyzeJobDescription = useCallback((description: string): JobAnalysis | null => {
    const validation = validateJobDescription(description);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid job description');
      return null;
    }

    return {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      keySkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python', 'SQL'],
      requirements: [
        '5+ years of software development experience',
        'Strong knowledge of React and Node.js',
        'Experience with cloud platforms (AWS preferred)',
        'Bachelor\'s degree in Computer Science or related field'
      ]
    };
  }, []);

  const optimizeResume = useCallback(async (
    resumeData: ResumeData, 
    jobDescription: string
  ): Promise<OptimizationResult | null> => {
    setIsOptimizing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: OptimizationResult = {
        optimizedResume: {
          ...resumeData,
          personalInfo: {
            ...resumeData.personalInfo,
            summary: 'Results-driven professional with extensive experience in target industry, specializing in key skills that directly align with the requirements of this position.'
          }
        },
        matchScore: 81,
        improvementItems: 5,
        keywordMatches: 12,
        matchedKeywords: ['leadership', 'project management', 'strategic planning'],
        addedKeywords: ['cross-functional collaboration', 'stakeholder management'],
        optimizationSuggestions: [
          'Enhanced professional summary with targeted keywords',
          'Restructured experience section for better impact',
          'Integrated industry-specific terminology'
        ],
        optimizationImprovements: [
          'deepAnalysisOptimization',
          'professionalExpressionUpgrade',
          'keywordIntegration',
          'preciseRequirementMatching',
          'structuralReorganization'
        ]
      };

      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Optimization failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    isOptimizing,
    error,
    optimizeResume,
    analyzeJobDescription,
    clearError
  };
}
'use client';

import { useState, useCallback } from 'react';
import { ResumeData, OptimizationResult, JobAnalysis } from '@/lib/types';
import { validateJobDescription } from '@/lib/utils';

// 新增类型定义
interface OptimizationRecord {
  id: string;
  job_title: string;
  company: string;
  match_score: number;
  created_at: string;
  original_resume_content: string;
  optimized_resume_content: string;
}

interface KeywordAnalysis {
  matched_keywords: string[];
  added_keywords: string[];
  missing_keywords: string[];
}

interface Suggestion {
  id: string;
  suggestion_type: 'content' | 'format' | 'keyword' | 'structure';
  suggestion_text: string;
  priority: number; // 1: 高优先级, 2: 中优先级, 3: 低优先级
}

interface UseOptimizationReturn {
  isOptimizing: boolean;
  loading: boolean;
  error: Error | string | null;
  optimization?: OptimizationRecord;
  keywordAnalysis?: KeywordAnalysis;
  suggestions?: Suggestion[];
  optimizeResume: (resumeData: ResumeData, jobDescription: string) => Promise<OptimizationResult | null>;
  analyzeJobDescription: (description: string) => JobAnalysis | null;
  fetchOptimizationDetail: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useOptimization(): UseOptimizationReturn {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | string | null>(null);
  const [optimization, setOptimization] = useState<OptimizationRecord | undefined>();
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | undefined>();
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>();

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

  const fetchOptimizationDetail = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockOptimization: OptimizationRecord = {
        id,
        job_title: '高级软件工程师',
        company: 'TechCorp',
        match_score: 85,
        created_at: new Date().toISOString(),
        original_resume_content: '原始简历内容...',
        optimized_resume_content: '优化后的简历内容...'
      };

      const mockKeywordAnalysis: KeywordAnalysis = {
        matched_keywords: ['React', 'Node.js', 'TypeScript'],
        added_keywords: ['系统架构', '团队管理'],
        missing_keywords: ['Kubernetes', 'GraphQL']
      };

      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          suggestion_type: 'content',
          suggestion_text: '建议在技能部分添加更多具体的技术细节和项目经验',
          priority: 1
        },
        {
          id: '2', 
          suggestion_type: 'keyword',
          suggestion_text: '在工作经历中添加具体的数据和成果指标以提升匹配度',
          priority: 2
        },
        {
          id: '3',
          suggestion_type: 'structure',
          suggestion_text: '重新组织简历结构，将最相关的经验放在前面',
          priority: 2
        }
      ];

      setOptimization(mockOptimization);
      setKeywordAnalysis(mockKeywordAnalysis);
      setSuggestions(mockSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err : '获取优化详情失败');
    } finally {
      setLoading(false);
    }
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
    loading,
    error,
    optimization,
    keywordAnalysis,
    suggestions,
    optimizeResume,
    analyzeJobDescription,
    fetchOptimizationDetail,
    clearError
  };
}
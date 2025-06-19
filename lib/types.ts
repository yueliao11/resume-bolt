// 基础类型定义
export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'de' | 'it' | 'es';

export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  details?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  achievements?: string[];
}

// 新增HR分析接口
export interface RecruitmentIntent {
  coreRequirements: string[];
  hiddenExpectations: string[];
  culturalFit: string;
  careerLevel: string;
}

export interface EnhancementAnalysis {
  professionalUpgrades: string[];
  languageRefinements: string[];
  structuralImprovements: string[];
}

export interface OptimizationResult {
  optimizedResume: ResumeData;
  matchScore: number;
  improvementItems: number;
  keywordMatches: number;
  matchedKeywords: string[];
  addedKeywords: string[];
  optimizationSuggestions: string[];
  optimizationImprovements: string[];
  // 新增的HR专业分析字段
  jobLanguage?: string;
  recruitmentIntent?: RecruitmentIntent;
  enhancementAnalysis?: EnhancementAnalysis;
}

export interface JobAnalysis {
  title: string;
  company: string;
  location: string;
  type: string;
  keySkills: string[];
  requirements: string[];
}

export interface OptimizationRecord {
  id: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

export type Step = 'upload' | 'job' | 'optimize' | 'results';

export interface StepConfig {
  id: Step;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
}
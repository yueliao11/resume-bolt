'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/lib/language-context';
import { useOptimization } from '@/lib/hooks/useOptimization';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { JobAnalysis } from '@/lib/types';
import { Target, Building, MapPin, Briefcase, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobDescriptionInputProps {
  onSubmit: (description: string) => void;
}

export function JobDescriptionInput({ onSubmit }: JobDescriptionInputProps) {
  const { t } = useLanguage();
  const { analyzeJobDescription, error, clearError } = useOptimization();
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const debouncedJobDescription = useDebounce(jobDescription, 1000);

  // 实时分析职位描述
  useState(() => {
    if (debouncedJobDescription.length > 100) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const result = analyzeJobDescription(debouncedJobDescription);
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 1500);
    } else {
      setAnalysis(null);
      setIsAnalyzing(false);
    }
  });

  const handleInputChange = (value: string) => {
    setJobDescription(value);
    clearError();
  };

  const handleSubmit = () => {
    if (jobDescription.trim() && jobDescription.length >= 50) {
      onSubmit(jobDescription);
    }
  };

  const getAnalysisProgress = () => {
    const length = jobDescription.length;
    if (length < 50) return 0;
    if (length < 100) return 25;
    if (length < 200) return 50;
    if (length < 500) return 75;
    return 100;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-6 w-6" />
            Job Description Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            Paste the job description you're targeting to get a customized resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
            />
            
            {/* Character counter with progress */}
            <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-xs text-slate-400">
                {jobDescription.length} characters
              </span>
            </div>
          </div>
          
          {/* Analysis Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Analysis Progress</span>
              <span className="text-sm text-slate-400">{getAnalysisProgress()}%</span>
            </div>
            <Progress value={getAnalysisProgress()} className="w-full" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isAnalyzing && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-4 w-4 text-purple-400" />
                </motion.div>
              )}
              <span className="text-sm text-slate-400">
                {isAnalyzing ? 'Analyzing...' : 'Ready for analysis'}
              </span>
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!jobDescription.trim() || jobDescription.length < 50}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze & Optimize
            </Button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400 flex items-center justify-between">
                    <span>{typeof error === 'string' ? error : error?.message || '发生错误'}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearError}
                      className="text-red-400 hover:text-red-300"
                    >
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Job Analysis Summary</CardTitle>
                <CardDescription className="text-slate-300">
                  AI has analyzed the job description and extracted key information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">{analysis.title}</p>
                        <p className="text-slate-400 text-sm">{analysis.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">{analysis.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">{analysis.location}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <h4 className="text-white font-medium mb-2">Key Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keySkills.map((skill: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <Badge variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10 transition-colors duration-200">
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-white font-medium mb-2">Key Requirements</h4>
                  <ul className="text-slate-300 space-y-1">
                    {analysis.requirements.map((req: string, index: number) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="text-purple-400 mt-1">•</span>
                        {req}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
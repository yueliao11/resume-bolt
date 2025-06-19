'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/language-context';
import { useOptimization } from '@/lib/hooks/useOptimization';
import { JobAnalysis } from '@/lib/types';
import { Target, Building, MapPin, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobDescriptionInputProps {
  onSubmit: (description: string) => void;
}

export function JobDescriptionInput({ onSubmit }: JobDescriptionInputProps) {
  const { t } = useLanguage();
  const { analyzeJobDescription, error, clearError } = useOptimization();
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  const handleInputChange = (value: string) => {
    setJobDescription(value);
    clearError();
    
    if (value.length > 100) {
      const result = analyzeJobDescription(value);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  };

  const handleSubmit = () => {
    if (jobDescription.trim() && jobDescription.length >= 50) {
      onSubmit(jobDescription);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
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
          <Textarea
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">
              {jobDescription.length} characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!jobDescription.trim() || jobDescription.length < 50}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze & Optimize
            </Button>
          </div>

          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400 flex items-center justify-between">
                <span>{error}</span>
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
          )}
        </CardContent>
      </Card>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Job Analysis Summary</CardTitle>
              <CardDescription className="text-slate-300">
                AI has analyzed the job description and extracted key information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Key Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keySkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-purple-400 text-purple-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Key Requirements</h4>
                <ul className="text-slate-300 space-y-1">
                  {analysis.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
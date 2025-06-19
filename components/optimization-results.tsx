'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/language-context';
import { OptimizationResult } from '@/lib/types';
import { 
  Download, 
  FileText, 
  Printer, 
  RefreshCw, 
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OptimizationResultsProps {
  data: OptimizationResult;
  onCreateNew: () => void;
}

export function OptimizationResults({ data, onCreateNew }: OptimizationResultsProps) {
  const { t } = useLanguage();

  const handleDownloadPDF = () => {
    // Mock PDF download
    console.log('Downloading PDF...');
  };

  const handleDownloadWord = () => {
    // Mock Word download
    console.log('Downloading Word...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Success Alert */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            <strong>{t('results.successMessage')}</strong><br />
            {t('results.successDesc')}
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('results.title')}
        </h1>
        <p className="text-slate-300">
          {t('results.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-1">
                {data.matchScore}%
              </h3>
              <p className="text-white font-medium">
                {t('results.matchRate')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-1">
                {data.improvementItems}
              </h3>
              <p className="text-white font-medium">
                {t('results.improvements')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-1">
                {data.keywordMatches}
              </h3>
              <p className="text-white font-medium">
                {t('results.keywordMatches')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {t('results.keywordAnalysis')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">
                  {t('results.matchedKeywords')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.matchedKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} className="bg-green-500/20 text-green-300 border-green-500/30">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">
                  {t('results.addedKeywords')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.addedKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">
                  {t('results.suggestions')}
                </h4>
                <ul className="text-slate-300 space-y-1">
                  {data.optimizationSuggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimization Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {t('results.optimizationImprovements')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.optimizationImprovements.map((improvement: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resume Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {t('results.resumePreview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-8 text-black min-h-[400px]">
              <div className="border-b-2 border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.optimizedResume.personalInfo.name}
                </h1>
                <p className="text-gray-600">
                  {data.optimizedResume.personalInfo.email}
                </p>
                <p className="text-gray-800 mt-2 leading-relaxed">
                  {data.optimizedResume.personalInfo.summary}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                  <div className="space-y-3">
                    {data.optimizedResume.experience.map((exp, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company} | {exp.duration}</p>
                        <p className="text-gray-700 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.optimizedResume.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button 
          onClick={handleDownloadPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('results.downloadPDF')}
        </Button>
        
        <Button 
          onClick={handleDownloadWord}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
        >
          <FileText className="h-4 w-4 mr-2" />
          {t('results.downloadWord')}
        </Button>
        
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700 px-6 py-3"
        >
          <Printer className="h-4 w-4 mr-2" />
          {t('results.printResume')}
        </Button>
        
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('results.createNew')}
        </Button>
      </motion.div>
    </div>
  );
}
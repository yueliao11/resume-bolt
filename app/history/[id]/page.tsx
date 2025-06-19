'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/lib/language-context';
import { useOptimization } from '@/lib/hooks/useOptimization';
import { formatDate, getMatchScoreColor } from '@/lib/utils';
import { 
  ArrowLeft,
  Building,
  Calendar,
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OptimizationDetail() {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const { 
    optimization,
    keywordAnalysis,
    suggestions,
    loading,
    error,
    fetchOptimizationDetail 
  } = useOptimization();

  useEffect(() => {
    setMounted(true);
    if (id && typeof id === 'string') {
      fetchOptimizationDetail(id);
    }
  }, [id, fetchOptimizationDetail]);

  if (!mounted || !isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-slate-300">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !optimization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                加载失败
              </h3>
              <p className="text-slate-400 mb-6">
                {error?.message || '未找到优化记录'}
              </p>
              <Link href="/history">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  返回历史记录
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/history">
          <Button variant="ghost" className="text-slate-300 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回历史记录
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {optimization.job_title}
            </h1>
            <Badge className={getMatchScoreColor(optimization.match_score)}>
              {optimization.match_score}% 匹配
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {optimization.company}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {formatDate(optimization.created_at)}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="resume">简历对比</TabsTrigger>
            <TabsTrigger value="keywords">关键词分析</TabsTrigger>
            <TabsTrigger value="suggestions">改进建议</TabsTrigger>
          </TabsList>

          {/* Resume Comparison */}
          <TabsContent value="resume">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">原始简历</h3>
                  <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm">
                    {optimization.original_resume_content}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">优化后的简历</h3>
                  <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm">
                    {optimization.optimized_resume_content}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Keyword Analysis */}
          <TabsContent value="keywords">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4">匹配的关键词</h3>
                    <div className="space-y-2">
                      {keywordAnalysis?.matched_keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2 border-green-500/30 text-green-400">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4">新增的关键词</h3>
                    <div className="space-y-2">
                      {keywordAnalysis?.added_keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2 border-blue-500/30 text-blue-400">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                      <XCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4">缺失的关键词</h3>
                    <div className="space-y-2">
                      {keywordAnalysis?.missing_keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2 border-red-500/30 text-red-400">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Improvement Suggestions */}
          <TabsContent value="suggestions">
            <div className="space-y-4">
              {suggestions?.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {suggestion.suggestion_type === 'content' && '内容改进'}
                              {suggestion.suggestion_type === 'format' && '格式改进'}
                              {suggestion.suggestion_type === 'keyword' && '关键词改进'}
                              {suggestion.suggestion_type === 'structure' && '结构改进'}
                            </h3>
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                              {suggestion.priority === 1 && '高优先级'}
                              {suggestion.priority === 2 && '中优先级'}
                              {suggestion.priority === 3 && '低优先级'}
                            </Badge>
                          </div>
                          <p className="text-slate-300">
                            {suggestion.suggestion_text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => {
              // TODO: 实现下载功能
              const content = optimization.optimized_resume_content;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `优化后的简历_${optimization.job_title}.txt`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            下载优化后的简历
          </Button>
        </div>
      </div>
    </div>
  );
} 
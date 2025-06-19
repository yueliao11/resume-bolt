'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/lib/language-context';
import { OptimizationRecord } from '@/lib/types';
import { formatDate, getStatusColor, getMatchScoreColor } from '@/lib/utils';
import { 
  Calendar,
  Download,
  Eye,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function History() {
  const { user, isLoaded } = useUser();
  const { t } = useLanguage();
  const [records, setRecords] = useState<OptimizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const mockRecords: OptimizationRecord[] = [
        {
          id: '1',
          jobTitle: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          matchScore: 87,
          createdAt: '2024-01-15',
          status: 'completed'
        },
        {
          id: '2',
          jobTitle: 'Full Stack Developer',
          company: 'StartupXYZ',
          matchScore: 92,
          createdAt: '2024-01-10',
          status: 'completed'
        },
        {
          id: '3',
          jobTitle: 'Product Manager',
          company: 'InnovateCorp',
          matchScore: 78,
          createdAt: '2024-01-05',
          status: 'completed'
        }
      ];
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const averageMatchScore = records.length > 0 
    ? Math.round(records.reduce((acc, r) => acc + r.matchScore, 0) / records.length)
    : 0;

  const completedCount = records.filter(r => r.status === 'completed').length;

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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t('nav.history')}
          </h1>
          <p className="text-slate-300">
            View and manage your resume optimization history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {records.length}
              </h3>
              <p className="text-slate-300">Total Optimizations</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {averageMatchScore}%
              </h3>
              <p className="text-slate-300">Average Match Score</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {completedCount}
              </h3>
              <p className="text-slate-300">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Optimization Records */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Loading optimization history...</p>
            </div>
          ) : records.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No optimizations yet
                </h3>
                <p className="text-slate-400 mb-6">
                  Start by uploading your resume and optimizing it for a job position
                </p>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create First Optimization
                </Button>
              </CardContent>
            </Card>
          ) : (
            records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {record.jobTitle}
                          </h3>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-300 mb-2">
                          {record.company}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(record.createdAt)}
                          </span>
                          <span className={`flex items-center gap-1 font-medium ${getMatchScoreColor(record.matchScore)}`}>
                            <TrendingUp className="h-4 w-4" />
                            {record.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
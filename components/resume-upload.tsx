'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ResumePreview } from '@/components/resume-preview';
import { useLanguage } from '@/lib/language-context';
import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { ResumeData } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeUploadProps {
  onUpload: (data: ResumeData) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const { t } = useLanguage();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  
  const {
    file,
    isUploading,
    error,
    getRootProps,
    getInputProps,
    isDragActive,
    clearError,
    reset
  } = useFileUpload((data: ResumeData) => {
    setResumeData(data);
    setShowPreview(true);
  });

  // 模拟上传进度
  useState(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  });

  const handleConfirmPreview = () => {
    if (resumeData) {
      onUpload(resumeData);
    }
  };

  const handleReupload = () => {
    setShowPreview(false);
    setResumeData(null);
    reset();
  };

  // 如果显示预览，渲染预览组件
  if (showPreview && resumeData) {
    return (
      <ResumePreview
        resumeData={resumeData}
        onConfirm={handleConfirmPreview}
        onReupload={handleReupload}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-6 w-6" />
            {t('upload.title')}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {t('upload.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
              ${isDragActive 
                ? 'border-purple-400 bg-purple-400/10 scale-105' 
                : 'border-slate-600 hover:border-slate-500 bg-slate-700/30 hover:bg-slate-700/50'
              }
            `}
          >
            <input {...getInputProps()} />
            
            {/* Background Animation */}
            <AnimatePresence>
              {isDragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg"
                />
              )}
            </AnimatePresence>

            <div className="space-y-4 relative z-10">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="space-y-4"
                  >
                    <Upload className="h-12 w-12 text-purple-400 mx-auto animate-bounce" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-white">Processing...</p>
                      <Progress value={uploadProgress} className="w-64 mx-auto" />
                      <p className="text-sm text-slate-400">{uploadProgress}% complete</p>
                    </div>
                  </motion.div>
                ) : file ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-2"
                  >
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                    <p className="text-lg font-medium text-white">File uploaded successfully!</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-slate-400">{file.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          reset();
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-slate-500 text-sm">{formatFileSize(file.size)}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-2"
                  >
                    <motion.div
                      animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    </motion.div>
                    <p className="text-lg font-medium text-white">
                      {isDragActive ? 'Drop your resume here' : t('upload.dragDrop')}
                    </p>
                    <p className="text-slate-400">
                      {t('upload.formats')}
                    </p>
                    <Button variant="outline" className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700">
                      {t('upload.selectFile')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="bg-slate-700/30 border-slate-600">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('upload.tips')}
              </h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• {t('upload.tip1')}</li>
                <li>• {t('upload.tip2')}</li>
                <li>• {t('upload.tip3')}</li>
                <li>• {t('upload.tip4')}</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
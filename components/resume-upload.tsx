'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/language-context';
import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { ResumeData } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeUploadProps {
  onUpload: (data: ResumeData) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const { t } = useLanguage();
  const {
    file,
    isUploading,
    error,
    getRootProps,
    getInputProps,
    isDragActive,
    clearError
  } = useFileUpload(onUpload);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-800/50 border-slate-700">
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
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              {isUploading ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="space-y-2"
                >
                  <Upload className="h-12 w-12 text-purple-400 mx-auto animate-bounce" />
                  <p className="text-lg font-medium text-white">Processing...</p>
                </motion.div>
              ) : file ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                  <p className="text-lg font-medium text-white">File uploaded successfully!</p>
                  <p className="text-slate-400">{file.name}</p>
                  <p className="text-slate-500 text-sm">{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="text-lg font-medium text-white">
                    {t('upload.dragDrop')}
                  </p>
                  <p className="text-slate-400">
                    {t('upload.formats')}
                  </p>
                  <Button variant="outline" className="mt-4">
                    {t('upload.selectFile')}
                  </Button>
                </div>
              )}
            </div>
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
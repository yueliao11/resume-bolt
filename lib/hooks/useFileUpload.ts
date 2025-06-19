'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ResumeData } from '@/lib/types';
import { validateFile } from '@/lib/utils';

interface UseFileUploadReturn {
  file: File | null;
  isUploading: boolean;
  error: string | null;
  resumeData: ResumeData | null;
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  clearError: () => void;
  reset: () => void;
}

export function useFileUpload(onUpload?: (data: ResumeData) => void): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setIsUploading(false);
    setError(null);
    setResumeData(null);
  }, []);

  const processFile = useCallback(async (uploadedFile: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const validation = validateFile(uploadedFile);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResumeData: ResumeData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/johndoe',
          summary: 'Experienced software engineer with 5+ years in full-stack development'
        },
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            duration: '2021 - Present',
            description: 'Led development of scalable web applications using React and Node.js'
          },
          {
            title: 'Software Engineer',
            company: 'StartupXYZ',
            duration: '2019 - 2021',
            description: 'Developed responsive web interfaces and RESTful APIs'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of California, Berkeley',
            year: '2019',
            details: 'Graduated Magna Cum Laude'
          }
        ],
        skills: [
          'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git', 'Agile'
        ]
      };

      setResumeData(mockResumeData);
      onUpload?.(mockResumeData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile);
    }
  }, [processFile]);

  const supportedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: supportedTypes,
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  return {
    file,
    isUploading,
    error,
    resumeData,
    getRootProps,
    getInputProps,
    isDragActive,
    clearError,
    reset
  };
}
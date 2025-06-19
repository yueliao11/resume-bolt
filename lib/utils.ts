import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化工具函数
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getMatchScoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-blue-400';
  if (score >= 70) return 'text-yellow-400';
  return 'text-red-400';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    processing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[status] || colors.failed;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 验证工具函数
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload PDF, DOC, or DOCX files.'
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { isValid: true };
}

export function validateJobDescription(description: string): { isValid: boolean; error?: string } {
  if (!description.trim()) {
    return {
      isValid: false,
      error: 'Job description cannot be empty.'
    };
  }

  if (description.length < 50) {
    return {
      isValid: false,
      error: 'Job description is too short. Please provide more details.'
    };
  }

  return { isValid: true };
}
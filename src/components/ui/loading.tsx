
import React from 'react';
import { Loader2, Zap, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingStateProps {
  type?: 'api' | 'upload' | 'processing' | 'general';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'general',
  message,
  size = 'md',
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'api':
        return <Zap className="w-6 h-6 text-blue-500 animate-pulse" />;
      case 'upload':
        return <Upload className="w-6 h-6 text-green-500 animate-bounce" />;
      case 'processing':
        return <Database className="w-6 h-6 text-purple-500 animate-spin" />;
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'api':
        return 'Connecting to AI service...';
      case 'upload':
        return 'Uploading files...';
      case 'processing':
        return 'Processing data...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3 p-6',
      className
    )}>
      {getIcon()}
      <p className="text-sm text-muted-foreground animate-pulse">
        {getMessage()}
      </p>
    </div>
  );
};

interface ProgressBarProps {
  progress: number;
  message?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  message,
  className
}) => {
  return (
    <div className={cn('w-full space-y-2', className)}>
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="text-xs text-right text-muted-foreground">
        {Math.round(progress)}%
      </p>
    </div>
  );
};

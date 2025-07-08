
import { exportToExcel, exportChartAsPNG, exportToText } from '@/utils/exportUtils';
import { apiService } from '@/services/apiService';
import { ErrorHandler } from '@/utils/errorHandling';
import { processFileDataForAnalysis } from '@/utils/dataProcessing';

export const callGeminiAPI = async (prompt: string, fileContext: string) => {
  console.log('🔄 Functions Utils: Making API call', {
    promptLength: prompt.length,
    contextLength: fileContext.length
  });

  try {
    const result = await apiService.callGemini({
      prompt,
      context: fileContext,
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 2048
    });

    if (!result.success) {
      throw new Error(result.error || 'API call failed');
    }

    return result.data || '';
  } catch (error: any) {
    const appError = ErrorHandler.handleApiError(error);
    console.error('❌ Functions Utils Error:', appError);
    throw new Error(appError.message);
  }
};

// Re-export the utility functions
export { exportToExcel, exportChartAsPNG, exportToText, processFileDataForAnalysis };

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'maintenance': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

// Utility to check if API key is available
export const isGeminiApiAvailable = (): boolean => {
  const savedKeys = localStorage.getItem('api_keys');
  const legacyKey = localStorage.getItem('gemini_api_key');
  
  if (savedKeys) {
    const keys = JSON.parse(savedKeys);
    return keys.some((k: any) => k.provider === 'Gemini' && k.key?.trim());
  }
  
  return !!legacyKey?.trim();
};

// New utility for better data validation
export const validateFileData = (file: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!file) {
    errors.push('File object is null or undefined');
    return { isValid: false, errors };
  }
  
  if (!file.name) {
    errors.push('File name is missing');
  }
  
  if (!file.type) {
    errors.push('File type is missing');
  }
  
  if (file.size === undefined || file.size < 0) {
    errors.push('Invalid file size');
  }
  
  if (file.parsedData && !Array.isArray(file.parsedData)) {
    errors.push('Parsed data should be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

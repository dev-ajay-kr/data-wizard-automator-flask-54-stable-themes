
import { exportToExcel, exportChartAsPNG, exportToText } from '@/utils/exportUtils';

export const callGeminiAPI = async (prompt: string, fileContext: string) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set it in the chat interface first.');
  }

  console.log('Making API call to Gemini with prompt:', prompt.substring(0, 100) + '...');
  console.log('File context length:', fileContext.length);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt}\n\nData Context:\n${fileContext}\n\nPlease provide a structured response with actionable insights.`
        }]
      }]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('API Response received:', data);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// Re-export the utility functions
export { exportToExcel, exportChartAsPNG, exportToText };

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
  return !!localStorage.getItem('gemini_api_key');
};

// Enhanced file data processing
export const processFileDataForAnalysis = (files: any[]): string => {
  if (!files || files.length === 0) {
    return 'No data files available for analysis.';
  }

  return files.map(file => {
    const basicInfo = `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes`;
    
    if (file.parsedData && file.parsedData.length > 0) {
      const sampleData = file.parsedData.slice(0, 5);
      const columns = Object.keys(file.parsedData[0]);
      return `${basicInfo}\nRows: ${file.parsedData.length}\nColumns: [${columns.join(', ')}]\nSample Data:\n${JSON.stringify(sampleData, null, 2)}`;
    }
    
    if (file.preview && file.preview.length > 0) {
      const previewText = file.preview.slice(0, 5).map(row => row.join(',')).join('\n');
      return `${basicInfo}\nPreview:\n${previewText}`;
    }
    
    return basicInfo;
  }).join('\n\n');
};

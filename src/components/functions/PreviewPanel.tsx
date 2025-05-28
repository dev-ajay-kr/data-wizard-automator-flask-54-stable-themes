
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Play, AlertCircle, CheckCircle, Download, Image as ImageIcon } from 'lucide-react';
import { FunctionItem, FunctionResult } from './types';
import { getStatusColor } from './utils';

interface PreviewPanelProps {
  executingFunction: string | null;
  showFunctionDetails: boolean;
  selectedFunction: string | null;
  functionResult: FunctionResult | null;
  functionDetails: FunctionItem | null;
  filesLength: number;
  onCloseFunctionDetails: () => void;
  onExecuteFunction: (functionId: string) => void;
  onExportToExcel: (data: any, title: string) => void;
  onExportToPNG: (title: string) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  executingFunction,
  showFunctionDetails,
  selectedFunction,
  functionResult,
  functionDetails,
  filesLength,
  onCloseFunctionDetails,
  onExecuteFunction,
  onExportToExcel,
  onExportToPNG
}) => {
  if (executingFunction) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Function Executing</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Processing your data with Gemini AI...</p>
        </div>
      </div>
    );
  }

  if (showFunctionDetails && selectedFunction && functionDetails) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{functionDetails.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Function Details</p>
          </div>
          <Button 
            onClick={onCloseFunctionDetails}
            size="sm"
            variant="outline"
          >
            Close
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Description</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{functionDetails.details}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getStatusColor(functionDetails.status)}>{functionDetails.status}</Badge>
            <Badge variant="outline">{functionDetails.category}</Badge>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => onExecuteFunction(functionDetails.id)}
              disabled={executingFunction === functionDetails.id || functionDetails.status === 'maintenance' || filesLength === 0}
              size="sm"
              className="flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Execute Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (functionResult) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            {functionResult.error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{functionResult.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{functionResult.summary}</p>
            </div>
          </div>
          {functionResult.exportable && !functionResult.error && (
            <div className="flex gap-2">
              <Button 
                onClick={() => onExportToExcel(functionResult.details, functionResult.title)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Excel
              </Button>
              <Button 
                onClick={() => onExportToPNG(functionResult.title)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                PNG
              </Button>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-lg ${functionResult.error ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            {functionResult.error ? 'Error Details' : 'Analysis Results'}
          </h5>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{functionResult.details}</pre>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {functionResult.error ? 'Failed' : 'Executed'} at: {new Date(functionResult.timestamp).toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Code className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-center">
        {filesLength === 0 
          ? 'Upload data files and execute functions to see results here'
          : 'Execute a function or click the view icon to see details here'
        }
      </p>
    </div>
  );
};

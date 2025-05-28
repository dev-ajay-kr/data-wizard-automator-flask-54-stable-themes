
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Settings } from 'lucide-react';
import { FunctionItem } from './types';
import { getStatusColor } from './utils';

interface FunctionCardProps {
  func: FunctionItem;
  executingFunction: string | null;
  filesLength: number;
  onExecute: (functionId: string) => void;
  onView: (functionId: string) => void;
  onSettings: () => void;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({
  func,
  executingFunction,
  filesLength,
  onExecute,
  onView,
  onSettings
}) => {
  const isExecuting = executingFunction === func.id;
  const isMaintenance = func.status === 'maintenance';
  const hasFiles = filesLength > 0;
  const hasApiKey = !!localStorage.getItem('gemini_api_key');
  
  // Button should be disabled if: executing, in maintenance, no files, or no API key
  const isExecuteDisabled = isExecuting || isMaintenance || !hasFiles || !hasApiKey;

  const getDisabledReason = () => {
    if (isExecuting) return 'Function is executing...';
    if (isMaintenance) return 'Function is under maintenance';
    if (!hasApiKey) return 'API key required';
    if (!hasFiles) return 'No files uploaded';
    return '';
  };

  console.log('FunctionCard render:', {
    functionId: func.id,
    isExecuteDisabled,
    hasFiles,
    hasApiKey,
    status: func.status,
    reason: getDisabledReason()
  });

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{func.name}</h3>
            <Badge className={getStatusColor(func.status) + ' text-xs'}>{func.status}</Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{func.description}</p>
          <Badge variant="outline" className="text-xs">{func.category}</Badge>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => {
            console.log('Execute button clicked:', func.id);
            onExecute(func.id);
          }}
          disabled={isExecuteDisabled}
          size="sm"
          className="flex-1 text-xs"
          title={isExecuteDisabled ? getDisabledReason() : `Execute ${func.name}`}
        >
          {isExecuting ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              Executing...
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              Execute
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            console.log('View button clicked:', func.id);
            onView(func.id);
          }}
          className="text-xs"
          title={`View details for ${func.name}`}
        >
          <Eye className="w-3 h-3" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => {
            console.log('Settings button clicked');
            onSettings();
          }}
          title="Function settings"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, FileText, Zap, Settings, BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { FunctionCard } from './functions/FunctionCard';
import { PreviewPanel } from './functions/PreviewPanel';
import { DocumentationTab } from './functions/DocumentationTab';
import { etlFunctions, analyticsFunctions, automationFunctions } from './functions/data';
import { callGeminiAPI, exportToExcel, exportToPNG } from './functions/utils';
import { FunctionResult } from './functions/types';

export const Functions: React.FC = () => {
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionResult, setFunctionResult] = useState<FunctionResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showFunctionDetails, setShowFunctionDetails] = useState(false);
  const { toast } = useToast();
  const { files } = useFiles();

  const executeFunction = async (functionId: string) => {
    console.log('=== Function Execution Started ===');
    console.log('Function ID:', functionId);
    console.log('Files available:', files.length);
    console.log('Files data:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    // Check for API key first
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      console.error('No API key found');
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the chat interface first.",
        variant: "destructive"
      });
      return;
    }

    if (files.length === 0) {
      console.warn('No files uploaded');
      toast({
        title: "No Files Uploaded",
        description: "Please upload data files first to execute functions.",
        variant: "destructive"
      });
      return;
    }

    const selectedFunc = [...etlFunctions, ...analyticsFunctions, ...automationFunctions]
      .find(f => f.id === functionId);
    
    if (!selectedFunc) {
      console.error('Function not found:', functionId);
      toast({
        title: "Function Not Found",
        description: "The requested function could not be found.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFunc.status === 'maintenance') {
      console.warn('Function in maintenance:', functionId);
      toast({
        title: "Function Unavailable",
        description: "This function is currently under maintenance.",
        variant: "destructive"
      });
      return;
    }

    setExecutingFunction(functionId);
    setSelectedFunction(functionId);
    
    try {
      console.log('Preparing file context...');
      const fileContext = files.map(file => {
        const preview = file.preview?.slice(0, 10).map(row => row.join(',')).join('\n') || '';
        return `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\nColumns: ${file.preview?.[0]?.length || 0}\nRows: ${file.preview?.length || 0}\nPreview:\n${preview}`;
      }).join('\n\n');

      console.log('File context prepared, length:', fileContext.length);

      let prompt = '';
      switch (functionId) {
        case 'data-cleansing':
          prompt = 'Analyze the data for quality issues including duplicates, missing values, inconsistent formats, and outliers. Provide specific recommendations for data cleansing with counts and percentages.';
          break;
        case 'data-transformation':
          prompt = 'Suggest data transformations to improve data structure and usability. Include normalization opportunities, data type conversions, and business rule applications.';
          break;
        case 'data-validation':
          prompt = 'Validate data integrity, check for business rule violations, and assess overall data quality. Provide validation scores and specific issues found.';
          break;
        case 'statistical-analysis':
          prompt = 'Perform comprehensive statistical analysis including descriptive statistics, distributions, correlations, and significance tests. Provide numerical results and interpretations.';
          break;
        case 'correlation-analysis':
          prompt = 'Analyze correlations between variables, identify strong relationships, and provide insights about dependencies in the data.';
          break;
        case 'outlier-detection':
          prompt = 'Detect outliers and anomalies in the data using statistical methods. Identify specific records and explain why they are considered outliers.';
          break;
        case 'schedule-etl':
          prompt = 'Based on the data characteristics, suggest useful ETL job schedules that would enhance data quality and provide value. Include specific job types, frequencies, and benefits.';
          break;
        case 'alert-system':
          prompt = 'Recommend alert configurations for data quality monitoring based on the data patterns observed. Include thresholds and trigger conditions.';
          break;
        case 'backup-restore':
          prompt = 'Suggest backup and restore strategies appropriate for this data type and volume. Include best practices and scheduling recommendations.';
          break;
        default:
          prompt = 'Analyze the data and provide relevant insights and recommendations.';
      }

      console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
      const response = await callGeminiAPI(prompt, fileContext);
      console.log('API response received, length:', response.length);
      
      setFunctionResult({
        title: selectedFunc.name,
        summary: `Analysis completed for ${files.length} file(s) with ${files.reduce((total, file) => total + (file.preview?.length || 0), 0)} total rows`,
        details: response,
        timestamp: new Date().toISOString(),
        functionId: functionId,
        exportable: true
      });

      console.log('Function execution completed successfully');
      toast({
        title: "Function Executed",
        description: `${selectedFunc.name} completed successfully using your uploaded data.`,
      });
    } catch (error: any) {
      console.error('Function execution error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        functionId,
        filesCount: files.length
      });
      
      setFunctionResult({
        title: 'Execution Error',
        summary: 'Function execution failed',
        details: error.message || 'Unknown error occurred during function execution. Please check your API key and network connection.',
        timestamp: new Date().toISOString(),
        functionId: functionId,
        exportable: false,
        error: true
      });
      
      toast({
        title: "Execution Failed",
        description: error.message || "Failed to execute function. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setExecutingFunction(null);
      console.log('=== Function Execution Ended ===');
    }
  };

  const allFunctions = [...etlFunctions, ...analyticsFunctions, ...automationFunctions];

  const getSelectedFunctionDetails = () => {
    if (!selectedFunction) return null;
    return allFunctions.find(f => f.id === selectedFunction);
  };

  const handleViewFunction = (functionId: string) => {
    console.log('View function requested:', functionId);
    setSelectedFunction(functionId);
    setShowFunctionDetails(true);
  };

  const handleSettings = () => {
    console.log('Settings requested');
    toast({
      title: "Settings",
      description: "Function settings coming soon!",
    });
  };

  const handleExportToExcel = (data: any, title: string) => {
    console.log('Excel export requested:', title);
    exportToExcel(data, title, toast);
  };

  const handleExportToPNG = (title: string) => {
    console.log('PNG export requested:', title);
    exportToPNG(title, toast);
  };

  // Check if API key is available
  const apiKey = localStorage.getItem('gemini_api_key');
  const showApiKeyWarning = !apiKey;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Functions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage and execute data processing functions and automation workflows</p>
        
        {showApiKeyWarning && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">API Key Required</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Please set your Gemini API key in the chat interface to enable function execution.
            </p>
          </div>
        )}
        
        {files.length > 0 ? (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {files.length} file(s) uploaded - Ready for processing
            </Badge>
          </div>
        ) : (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              No files uploaded - Upload data files to enable function execution
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Tabs defaultValue="etl" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="etl" className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                ETL Functions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4" />
                Documentation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="etl" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {etlFunctions.map((func) => (
                  <FunctionCard 
                    key={func.id} 
                    func={func}
                    executingFunction={executingFunction}
                    filesLength={files.length}
                    onExecute={executeFunction}
                    onView={handleViewFunction}
                    onSettings={handleSettings}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsFunctions.map((func) => (
                  <FunctionCard 
                    key={func.id} 
                    func={func}
                    executingFunction={executingFunction}
                    filesLength={files.length}
                    onExecute={executeFunction}
                    onView={handleViewFunction}
                    onSettings={handleSettings}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automationFunctions.map((func) => (
                  <FunctionCard 
                    key={func.id} 
                    func={func}
                    executingFunction={executingFunction}
                    filesLength={files.length}
                    onExecute={executeFunction}
                    onView={handleViewFunction}
                    onSettings={handleSettings}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <DocumentationTab />
            </TabsContent>
          </Tabs>
        </div>

        <Card className="w-full">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Function Results</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs"
            >
              {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showPreview && (
            <ScrollArea className="h-80">
              <div className="p-4">
                <PreviewPanel
                  executingFunction={executingFunction}
                  showFunctionDetails={showFunctionDetails}
                  selectedFunction={selectedFunction}
                  functionResult={functionResult}
                  functionDetails={getSelectedFunctionDetails()}
                  filesLength={files.length}
                  onCloseFunctionDetails={() => setShowFunctionDetails(false)}
                  onExecuteFunction={executeFunction}
                  onExportToExcel={handleExportToExcel}
                  onExportToPNG={handleExportToPNG}
                />
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, FileText, Zap, Settings, BookOpen, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { useGemini } from '@/hooks/useGemini';
import { FunctionCard } from './functions/FunctionCard';
import { PreviewPanel } from './functions/PreviewPanel';
import { DocumentationTab } from './functions/DocumentationTab';
import { etlFunctions, analyticsFunctions, automationFunctions } from './functions/data';
import { exportToExcel, exportToPNG, processFileDataForAnalysis } from './functions/utils';
import { FunctionResult } from './functions/types';

export const Functions: React.FC = () => {
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionResult, setFunctionResult] = useState<FunctionResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showFunctionDetails, setShowFunctionDetails] = useState(false);
  const { toast } = useToast();
  const { files, getFileData, getParsedData } = useFiles();
  const { callGemini, isLoading: geminiLoading } = useGemini();

  // Enhanced logging for debugging
  console.log('Functions component render:', {
    filesCount: files?.length || 0,
    filesWithData: files?.filter(f => f.parsedData && f.parsedData.length > 0).length || 0,
    totalParsedRows: getParsedData()?.length || 0,
    apiKeyAvailable: !!localStorage.getItem('gemini_api_key')
  });

  const executeFunction = async (functionId: string) => {
    console.log('=== Enhanced Function Execution Started ===');
    console.log('Function ID:', functionId);
    console.log('Files available:', files?.length || 0);
    console.log('Parsed data rows:', getParsedData()?.length || 0);

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

    if (!files || files.length === 0) {
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
      console.log('Preparing enhanced file context...');
      const fileContext = processFileDataForAnalysis(files);
      const parsedData = getParsedData();
      
      console.log('Enhanced file context prepared:', {
        contextLength: fileContext.length,
        parsedDataRows: parsedData.length
      });

      let prompt = '';
      switch (functionId) {
        case 'data-cleansing':
          prompt = `Analyze the uploaded data for quality issues including duplicates, missing values, inconsistent formats, and outliers. 
          Use the actual data provided to give specific counts, percentages, and examples. 
          Provide actionable recommendations for data cleansing with detailed steps.`;
          break;
        case 'data-transformation':
          prompt = `Examine the data structure and suggest specific transformations to improve usability. 
          Include normalization opportunities, data type conversions, calculated fields, and business rule applications.
          Reference the actual column names and data types from the uploaded files.`;
          break;
        case 'data-validation':
          prompt = `Validate data integrity by checking business rules, data consistency, and quality metrics.
          Provide validation scores for each file and identify specific records with issues.
          Give actionable recommendations based on the actual data patterns observed.`;
          break;
        case 'statistical-analysis':
          prompt = `Perform comprehensive statistical analysis on the numerical columns in the data.
          Include descriptive statistics, distributions, correlations, and trend analysis.
          Use the actual data to provide real insights and statistical measures.`;
          break;
        case 'correlation-analysis':
          prompt = `Analyze correlations between numerical variables in the uploaded data.
          Identify strong positive/negative relationships and provide business insights.
          Use actual column names and calculate real correlation coefficients where possible.`;
          break;
        case 'outlier-detection':
          prompt = `Detect outliers and anomalies in the numerical data using statistical methods.
          Identify specific records that are outliers and explain why based on the data distribution.
          Provide recommendations for handling these outliers.`;
          break;
        case 'schedule-etl':
          prompt = `Based on the data characteristics and business patterns observed, suggest ETL job schedules.
          Include specific job types, optimal frequencies, and expected benefits.
          Consider data volume, update patterns, and business requirements.`;
          break;
        case 'alert-system':
          prompt = `Recommend data quality alert configurations based on the patterns in the uploaded data.
          Include specific thresholds, trigger conditions, and monitoring recommendations.
          Base suggestions on actual data characteristics observed.`;
          break;
        case 'backup-restore':
          prompt = `Suggest backup and restore strategies for this specific data type and volume.
          Include scheduling recommendations, retention policies, and disaster recovery procedures.
          Consider the data criticality and update frequency patterns.`;
          break;
        default:
          prompt = 'Analyze the uploaded data and provide relevant insights and actionable recommendations.';
      }

      console.log('Calling Gemini API with enhanced prompt...');
      const response = await callGemini(prompt, fileContext);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      console.log('Enhanced API response received');
      
      setFunctionResult({
        title: selectedFunc.name,
        summary: `Analysis completed for ${files.length} file(s) with ${parsedData.length} total data rows`,
        details: response.text,
        timestamp: new Date().toISOString(),
        functionId: functionId,
        exportable: true
      });

      console.log('Enhanced function execution completed successfully');
      toast({
        title: "Function Executed Successfully",
        description: `${selectedFunc.name} completed with enhanced data analysis.`,
      });
    } catch (error: any) {
      console.error('Enhanced function execution error:', error);
      
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
      console.log('=== Enhanced Function Execution Ended ===');
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
  const hasProcessedData = getParsedData().length > 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Functions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage and execute data processing functions with enhanced file analysis</p>
        
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
        
        <div className="mt-3 flex gap-4">
          {files && files.length > 0 ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {files.length} file(s) uploaded • {getParsedData().length} data rows ready
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                No files uploaded - Upload data files to enable functions
              </Badge>
            </div>
          )}
          
          {apiKey && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Gemini API Ready
              </Badge>
            </div>
          )}
        </div>
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
                    filesLength={files?.length || 0}
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
                    filesLength={files?.length || 0}
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
                    filesLength={files?.length || 0}
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
                  filesLength={files?.length || 0}
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

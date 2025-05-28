
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Play, FileText, Zap, Settings, BookOpen, ChevronDown, ChevronUp, Eye, Download, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';

export const Functions: React.FC = () => {
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionResult, setFunctionResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showFunctionDetails, setShowFunctionDetails] = useState(false);
  const { toast } = useToast();
  const { files } = useFiles();

  const callGeminiAPI = async (prompt: string, fileContext: string) => {
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

  const exportToExcel = async (data: any, filename: string) => {
    try {
      console.log('Exporting to Excel:', filename, data);
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Results exported as ${filename}.csv`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportToPNG = async (filename: string) => {
    try {
      console.log('PNG export requested for:', filename);
      // For now, we'll show a message that this feature is coming soon
      toast({
        title: "PNG Export",
        description: "Chart export as PNG is coming soon! Use Excel export for now.",
      });
    } catch (error) {
      console.error('PNG export error:', error);
      toast({
        title: "PNG Export Failed",
        description: "Failed to export chart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map(item => JSON.stringify(item)).join('\n');
    }
    return JSON.stringify(data, null, 2);
  };

  const etlFunctions = [
    {
      id: 'data-cleansing',
      name: 'Data Cleansing',
      description: 'Remove duplicates, handle missing values, and standardize formats',
      category: 'ETL',
      status: 'active',
      details: 'Analyzes your uploaded data for quality issues including duplicates, missing values, inconsistent formats, and outliers. Provides specific recommendations with counts and percentages.'
    },
    {
      id: 'data-transformation',
      name: 'Data Transformation',
      description: 'Apply business rules and transform data structures',
      category: 'ETL',
      status: 'active',
      details: 'Suggests data transformations to improve structure and usability. Includes normalization opportunities, data type conversions, and business rule applications.'
    },
    {
      id: 'data-validation',
      name: 'Data Validation',
      description: 'Validate data quality and integrity',
      category: 'Quality',
      status: 'active',
      details: 'Validates data integrity, checks for business rule violations, and assesses overall data quality with validation scores and specific issues.'
    }
  ];

  const analyticsFunctions = [
    {
      id: 'statistical-analysis',
      name: 'Statistical Analysis',
      description: 'Generate descriptive statistics and distributions',
      category: 'Analytics',
      status: 'active',
      details: 'Performs comprehensive statistical analysis including descriptive statistics, distributions, correlations, and significance tests with numerical results and interpretations.'
    },
    {
      id: 'correlation-analysis',
      name: 'Correlation Analysis',
      description: 'Identify relationships between variables',
      category: 'Analytics',
      status: 'active',
      details: 'Analyzes correlations between variables, identifies strong relationships, and provides insights about dependencies in your data.'
    },
    {
      id: 'outlier-detection',
      name: 'Outlier Detection',
      description: 'Detect anomalies and outliers in data',
      category: 'Analytics',
      status: 'beta',
      details: 'Detects outliers and anomalies using statistical methods. Identifies specific records and explains why they are considered outliers.'
    }
  ];

  const automationFunctions = [
    {
      id: 'schedule-etl',
      name: 'Schedule ETL Jobs',
      description: 'Set up automated data processing pipelines',
      category: 'Automation',
      status: 'active',
      details: 'Suggests useful ETL job schedules based on data characteristics to enhance data quality and provide value with specific job types and frequencies.'
    },
    {
      id: 'alert-system',
      name: 'Alert System',
      description: 'Configure alerts for data quality issues',
      category: 'Automation',
      status: 'active',
      details: 'Recommends alert configurations for data quality monitoring based on observed data patterns, including thresholds and trigger conditions.'
    },
    {
      id: 'backup-restore',
      name: 'Backup & Restore',
      description: 'Automated backup and restore procedures',
      category: 'Automation',
      status: 'maintenance',
      details: 'Suggests backup and restore strategies appropriate for data type and volume, including best practices and scheduling recommendations.'
    }
  ];

  const executeFunction = async (functionId: string) => {
    if (files.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload data files first to execute functions.",
        variant: "destructive"
      });
      return;
    }

    console.log('Executing function:', functionId, 'with', files.length, 'files');
    setExecutingFunction(functionId);
    setSelectedFunction(functionId);
    
    try {
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

      const response = await callGeminiAPI(prompt, fileContext);
      
      const functionName = etlFunctions.concat(analyticsFunctions, automationFunctions).find(f => f.id === functionId)?.name || 'Function Results';
      
      setFunctionResult({
        title: functionName,
        summary: `Analysis completed for ${files.length} file(s) with ${files.reduce((total, file) => total + (file.preview?.length || 0), 0)} total rows`,
        details: response,
        timestamp: new Date().toISOString(),
        functionId: functionId,
        exportable: true
      });

      console.log('Function execution completed successfully');
      toast({
        title: "Function Executed",
        description: `${functionName} completed successfully using your uploaded data.`,
      });
    } catch (error) {
      console.error('Function execution error:', error);
      setFunctionResult({
        title: 'Execution Error',
        summary: 'Function execution failed',
        details: error.message || 'Unknown error occurred',
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const allFunctions = [...etlFunctions, ...analyticsFunctions, ...automationFunctions];

  const getSelectedFunctionDetails = () => {
    if (!selectedFunction) return null;
    return allFunctions.find(f => f.id === selectedFunction);
  };

  const FunctionCard = ({ func }: { func: any }) => (
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
          onClick={() => executeFunction(func.id)}
          disabled={executingFunction === func.id || func.status === 'maintenance' || files.length === 0}
          size="sm"
          className="flex-1 text-xs"
        >
          {executingFunction === func.id ? (
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
            setSelectedFunction(func.id);
            setShowFunctionDetails(true);
            console.log('View button clicked for function:', func.id);
          }}
          className="text-xs"
        >
          <Eye className="w-3 h-3" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => {
            toast({
              title: "Settings",
              description: "Function settings coming soon!",
            });
          }}
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );

  const renderPreview = () => {
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

    if (showFunctionDetails && selectedFunction) {
      const funcDetails = getSelectedFunctionDetails();
      if (funcDetails) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{funcDetails.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Function Details</p>
              </div>
              <Button 
                onClick={() => setShowFunctionDetails(false)}
                size="sm"
                variant="outline"
              >
                Close
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Description</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{funcDetails.details}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getStatusColor(funcDetails.status)}>{funcDetails.status}</Badge>
                <Badge variant="outline">{funcDetails.category}</Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => executeFunction(funcDetails.id)}
                  disabled={executingFunction === funcDetails.id || funcDetails.status === 'maintenance' || files.length === 0}
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
                  onClick={() => exportToExcel(functionResult.details, functionResult.title)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Excel
                </Button>
                <Button 
                  onClick={() => exportToPNG(functionResult.title)}
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
          {files.length === 0 
            ? 'Upload data files and execute functions to see results here'
            : 'Execute a function or click the view icon to see details here'
          }
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Functions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage and execute data processing functions and automation workflows</p>
        {files.length > 0 && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {files.length} file(s) uploaded - Ready for processing
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Functions Panel */}
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
                  <FunctionCard key={func.id} func={func} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsFunctions.map((func) => (
                  <FunctionCard key={func.id} func={func} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automationFunctions.map((func) => (
                  <FunctionCard key={func.id} func={func} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Function Documentation</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">ETL Functions</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Data Cleansing</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Purpose:</strong> Removes inconsistencies and errors from datasets using AI analysis
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Input:</strong> Your uploaded CSV files
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Output:</strong> Detailed quality report with specific recommendations
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Functions</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Statistical Analysis</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Purpose:</strong> AI-powered statistical analysis of your actual data
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Input:</strong> Numeric datasets from uploaded files
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Output:</strong> Comprehensive statistical insights and interpretations
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Automation Functions</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Schedule ETL Jobs</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Purpose:</strong> AI suggests optimal ETL workflows based on your data
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Input:</strong> Data characteristics from uploaded files
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Output:</strong> Customized ETL job recommendations with schedules
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
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
                {renderPreview()}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};

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
import { ResponseFormatter } from './ResponseFormatter';
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
          prompt = `## Data Quality Analysis Request

**Objective**: Perform comprehensive data cleansing analysis

**Tasks**:
1. **Missing Data Analysis**
   - Count and percentage of missing values per column
   - Missing data patterns (MCAR, MAR, MNAR)
   
2. **Duplicate Detection**
   - Exact duplicates count
   - Partial duplicates identification
   
3. **Data Type Inconsistencies**
   - Expected vs actual data types
   - Format inconsistencies within columns
   
4. **Outlier Detection**
   - Statistical outliers using IQR method
   - Domain-specific outliers
   
5. **Recommendations**
   - Prioritized action items
   - Data cleansing strategies
   
**Format**: Use tables, headers, and bullet points for clear presentation.`;
          break;
        case 'statistical-analysis':
          prompt = `## Statistical Analysis Request

**Objective**: Comprehensive statistical analysis of numerical data

**Analysis Required**:

### Descriptive Statistics
| Metric | Column 1 | Column 2 | Column 3 |
|--------|----------|----------|----------|
| Mean | | | |
| Median | | | |
| Std Dev | | | |
| Min/Max | | | |

### Distribution Analysis
- **Normality tests** for each numerical column
- **Skewness and kurtosis** measurements
- **Outlier identification** using statistical methods

### Correlation Analysis
- Correlation matrix for numerical variables
- Strong relationships identification (|r| > 0.7)
- Statistical significance testing

### Key Insights
- **Business implications** of statistical findings
- **Data quality** observations
- **Recommendations** for further analysis`;
          break;
        default:
          prompt = `Analyze the uploaded data for ${selectedFunc.name}. Provide structured analysis with:
          
## Analysis Overview
Brief summary of the analysis performed

## Key Findings
- **Finding 1**: Description with data support
- **Finding 2**: Description with data support
- **Finding 3**: Description with data support

## Detailed Results
Comprehensive analysis results with tables and metrics

## Recommendations
1. **Immediate actions** required
2. **Strategic improvements** suggested
3. **Further analysis** recommendations

Use proper markdown formatting with headers (##, ###), tables (|), lists (-), and emphasis (**bold**, *italic*).`;
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

  const apiKey = localStorage.getItem('gemini_api_key');
  const showApiKeyWarning = !apiKey;
  const hasProcessedData = getParsedData().length > 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Functions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Execute powerful data processing functions with AI-enhanced analysis
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              {showApiKeyWarning ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  API Status
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {showApiKeyWarning ? 'API Key Required' : 'Gemini AI Ready'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              {files && files.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Data Files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {files?.length || 0} files uploaded
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              {hasProcessedData ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Data Rows
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getParsedData().length} rows ready
                </p>
              </div>
            </div>
          </Card>
        </div>

        {showApiKeyWarning && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">API Key Required</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Please set your Gemini API key in the chat interface to enable function execution.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <Tabs defaultValue="etl" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="etl" className="flex items-center gap-2 text-sm font-medium">
                <Zap className="w-4 h-4" />
                ETL Functions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2 text-sm font-medium">
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

        <Card className="w-full shadow-lg border-gray-200 dark:border-gray-700">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Function Results
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Detailed analysis results with enhanced formatting
              </p>
            </div>
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
            <ScrollArea className="h-96">
              <div className="p-6">
                {functionResult && !executingFunction ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {functionResult.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {functionResult.summary}
                        </p>
                      </div>
                      {functionResult.exportable && !functionResult.error && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleExportToExcel(functionResult.details, functionResult.title)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            Export Results
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className={`rounded-lg ${functionResult.error ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                      <div className="p-6">
                        <ResponseFormatter content={functionResult.details} />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      {functionResult.error ? 'Failed' : 'Executed'} at: {new Date(functionResult.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};

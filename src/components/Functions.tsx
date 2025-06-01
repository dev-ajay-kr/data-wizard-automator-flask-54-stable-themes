import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Eye, Settings, BookOpen, Search, Key, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FunctionCard } from './functions/FunctionCard';
import { PreviewPanel } from './functions/PreviewPanel';
import { DocumentationTab } from './functions/DocumentationTab';
import { functions } from './functions/data';
import { FunctionItem, FunctionResult } from './functions/types';
import { callGeminiAPI, exportToExcel, exportChartAsPNG, exportToText, isGeminiApiAvailable, processFileDataForAnalysis } from './functions/utils';
import { useFiles } from '@/contexts/FileContext';

export const Functions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [showFunctionDetails, setShowFunctionDetails] = useState(false);
  const [functionResult, setFunctionResult] = useState<FunctionResult | null>(null);
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();
  const { files } = useFiles();

  useEffect(() => {
    const hasApiKey = isGeminiApiAvailable();
    setShowApiKeyInput(!hasApiKey);
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "🔑 **API Key Saved**",
        description: "Gemini API key has been saved successfully.",
      });
    }
  };

  const handleExecuteFunction = async (functionId: string) => {
    if (!isGeminiApiAvailable()) {
      setShowApiKeyInput(true);
      toast({
        title: "🔑 **API Key Required**",
        description: "Please enter your Gemini API key to execute functions.",
        variant: "destructive"
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "📁 **No Data Files**",
        description: "Please upload data files first to execute functions.",
        variant: "destructive"
      });
      return;
    }

    const func = functions.find(f => f.id === functionId);
    if (!func) return;

    setExecutingFunction(functionId);
    setShowFunctionDetails(false);

    try {
      const fileContext = processFileDataForAnalysis(files);
      const response = await callGeminiAPI(func.prompt, fileContext);

      const result: FunctionResult = {
        id: functionId,
        title: func.name,
        summary: `Successfully executed ${func.name}`,
        details: response,
        timestamp: Date.now(),
        exportable: true
      };

      setFunctionResult(result);
      
      toast({
        title: "✅ **Function Executed**",
        description: `**${func.name}** completed successfully.`,
      });
    } catch (error: any) {
      console.error('Function execution error:', error);
      
      const errorResult: FunctionResult = {
        id: functionId,
        title: func.name,
        summary: 'Function execution failed',
        details: error.message || 'Unknown error occurred',
        timestamp: Date.now(),
        error: true,
        exportable: false
      };

      setFunctionResult(errorResult);
      
      toast({
        title: "❌ **Execution Failed**",
        description: error.message || 'Function execution failed. Please try again.',
        variant: "destructive"
      });
    } finally {
      setExecutingFunction(null);
    }
  };

  const handleViewFunction = (functionId: string) => {
    const func = functions.find(f => f.id === functionId);
    if (func) {
      setSelectedFunction(functionId);
      setShowFunctionDetails(true);
      setFunctionResult(null);
    }
  };

  const closeFunctionDetails = () => {
    setShowFunctionDetails(false);
    setSelectedFunction(null);
  };

  const handleExportToExcel = (data: any, title: string) => {
    exportToExcel(data, title);
  };

  const handleExportToPNG = (title: string) => {
    exportChartAsPNG('function-result-chart', title);
  };

  const filteredFunctions = functions.filter(func =>
    func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const functionDetails = selectedFunction ? functions.find(f => f.id === selectedFunction) : null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          **ETL Functions**
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Execute advanced data processing and analysis functions</p>
      </div>

      {/* API Key Setup */}
      {showApiKeyInput && (
        <Card className="p-4 mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">**Gemini API Key Required**</h3>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Functions require a Gemini API key for AI-powered analysis. Get your free key from Google AI Studio.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit}>Save Key</Button>
          </div>
        </Card>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">**{functions.filter(f => f.status === 'active').length}** Active Functions</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">**{functions.filter(f => f.status === 'beta').length}** Beta Functions</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">**{files.length}** Data Files Loaded</span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="functions" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Functions
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="functions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Functions List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search functions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {files.length === 0 && (
                <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800 dark:text-orange-200">**No Data Files**</h3>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Upload CSV files in the **CSV Upload** tab to execute functions with your data.
                  </p>
                </Card>
              )}

              <div className="grid gap-4">
                {filteredFunctions.map((func) => (
                  <FunctionCard
                    key={func.id}
                    func={func}
                    onExecute={handleExecuteFunction}
                    onView={handleViewFunction}
                    isExecuting={executingFunction === func.id}
                    filesAvailable={files.length > 0}
                    executingFunction={executingFunction}
                    filesLength={files.length}
                    onSettings={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <Card className="p-6 min-h-[400px]">
                <PreviewPanel
                  executingFunction={executingFunction}
                  showFunctionDetails={showFunctionDetails}
                  selectedFunction={selectedFunction}
                  functionResult={functionResult}
                  functionDetails={functionDetails}
                  filesLength={files.length}
                  onCloseFunctionDetails={closeFunctionDetails}
                  onExecuteFunction={handleExecuteFunction}
                  onExportToExcel={handleExportToExcel}
                  onExportToPNG={handleExportToPNG}
                />
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <DocumentationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

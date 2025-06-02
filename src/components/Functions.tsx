
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Eye, Settings, BookOpen, Search, AlertCircle, Home, Zap, Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FunctionCard } from './functions/FunctionCard';
import { DocumentationTab } from './functions/DocumentationTab';
import { etlFunctions, analyticsFunctions, automationFunctions } from './functions/data';
import { betaFunctions, betaFunctionCategories } from './functions/betaData';
import { FunctionItem, FunctionResult } from './functions/types';
import { callGeminiAPI, isGeminiApiAvailable, processFileDataForAnalysis } from './functions/utils';
import { useFiles } from '@/contexts/FileContext';
import { ResponseFormatter } from '@/components/ResponseFormatter';

export const Functions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [showFunctionDetails, setShowFunctionDetails] = useState(false);
  const [functionResult, setFunctionResult] = useState<FunctionResult | null>(null);
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('functions');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { files } = useFiles();
  const navigate = useNavigate();

  const allFunctions = [...etlFunctions, ...analyticsFunctions, ...automationFunctions, ...betaFunctions];

  const handleExecuteFunction = async (functionId: string) => {
    if (!isGeminiApiAvailable()) {
      toast({
        title: "🔑 API Key Required",
        description: "Please configure your Gemini API key in Home settings.",
        variant: "destructive"
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "📁 No Data Files",
        description: "Please upload data files first to execute functions.",
        variant: "destructive"
      });
      return;
    }

    const func = allFunctions.find(f => f.id === functionId);
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
        timestamp: Date.now().toString(),
        exportable: true
      };

      setFunctionResult(result);
      
      toast({
        title: "✅ Function Executed",
        description: `${func.name} completed successfully.`,
      });
    } catch (error: any) {
      console.error('Function execution error:', error);
      
      const errorResult: FunctionResult = {
        id: functionId,
        title: func.name,
        summary: 'Function execution failed',
        details: error.message || 'Unknown error occurred',
        timestamp: Date.now().toString(),
        error: true,
        exportable: false
      };

      setFunctionResult(errorResult);
      
      toast({
        title: "❌ Execution Failed",
        description: error.message || 'Function execution failed. Please try again.',
        variant: "destructive"
      });
    } finally {
      setExecutingFunction(null);
    }
  };

  const handleViewFunction = (functionId: string) => {
    const func = allFunctions.find(f => f.id === functionId);
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

  const getFilteredFunctions = () => {
    let functionsToFilter = allFunctions;
    
    if (selectedCategory !== 'all') {
      functionsToFilter = allFunctions.filter(func => func.category === selectedCategory);
    }
    
    return functionsToFilter.filter(func =>
      func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const functionDetails = selectedFunction ? allFunctions.find(f => f.id === selectedFunction) : null;

  const categories = [
    { id: 'all', name: 'All Functions', count: allFunctions.length },
    { id: 'ETL', name: 'ETL', count: etlFunctions.length },
    { id: 'Analytics', name: 'Analytics', count: analyticsFunctions.length },
    { id: 'Automation', name: 'Automation', count: automationFunctions.length },
    { id: 'Machine Learning', name: '🤖 ML Pipeline', count: betaFunctions.filter(f => f.category === 'Machine Learning').length },
    { id: 'Real-time Analytics', name: '📈 Real-time', count: betaFunctions.filter(f => f.category === 'Real-time Analytics').length },
    { id: 'Data Profiling', name: '🔍 Profiling', count: betaFunctions.filter(f => f.category === 'Data Profiling').length },
    { id: 'Cloud Platforms', name: '☁️ Cloud', count: betaFunctions.filter(f => f.category === 'Cloud Platforms').length },
    { id: 'AI Intelligence', name: '🧠 AI Intel', count: betaFunctions.filter(f => f.category === 'AI Intelligence').length }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-600 mb-2 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            <strong>ETL Functions Hub</strong>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Execute advanced data processing and AI-powered analysis functions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Chat
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium"><strong>{allFunctions.filter(f => f.status === 'active').length}</strong> Active Functions</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium"><strong>{allFunctions.filter(f => f.status === 'beta').length}</strong> Beta Functions</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium"><strong>{files.length}</strong> Data Files Loaded</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-purple-600" />
            <span className="font-medium"><strong>{betaFunctions.length}</strong> Advanced Analytics</span>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="functions" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Functions
          </TabsTrigger>
          <TabsTrigger value="beta" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Beta Functions
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
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search functions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-xs"
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {files.length === 0 && (
                <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800 dark:text-orange-200"><strong>No Data Files</strong></h3>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Upload CSV files in the <strong>CSV Upload</strong> tab to execute functions with your data.
                  </p>
                </Card>
              )}

              <div className="grid gap-4">
                {getFilteredFunctions().map((func) => (
                  <FunctionCard
                    key={func.id}
                    func={func}
                    onExecute={handleExecuteFunction}
                    onView={handleViewFunction}
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
                {functionResult && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{functionResult.title}</h3>
                      <Badge variant={functionResult.error ? "destructive" : "default"}>
                        {functionResult.error ? "Failed" : "Success"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Executed at: {new Date(parseInt(functionResult.timestamp)).toLocaleString()}
                    </div>
                    
                    <div className="border-t pt-4">
                      <ResponseFormatter 
                        content={functionResult.details}
                        enableExports={functionResult.exportable && !functionResult.error}
                        title={functionResult.title}
                      />
                    </div>
                  </div>
                )}
                
                {showFunctionDetails && functionDetails && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{functionDetails.name}</h3>
                      <Button onClick={closeFunctionDetails} variant="outline" size="sm">
                        Close
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Category</Label>
                        <Badge variant="outline" className="ml-2">{functionDetails.category}</Badge>
                        <Badge className={`ml-2 ${functionDetails.status === 'beta' ? 'bg-purple-100 text-purple-800' : ''}`}>
                          {functionDetails.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {functionDetails.description}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Details</Label>
                        <div className="mt-1">
                          <ResponseFormatter content={functionDetails.details} />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleExecuteFunction(functionDetails.id)}
                      disabled={files.length === 0}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Execute Function
                    </Button>
                  </div>
                )}
                
                {!functionResult && !showFunctionDetails && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Select a function to view details or execute</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="beta">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
                <Beaker className="w-6 h-6" />
                🚀 Advanced Analytics Beta Functions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cutting-edge AI and machine learning powered data analysis capabilities
              </p>
            </div>

            {betaFunctionCategories.map((category) => (
              <Card key={category.id} className="p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {category.functions.map((func) => (
                    <FunctionCard
                      key={func.id}
                      func={func}
                      onExecute={handleExecuteFunction}
                      onView={handleViewFunction}
                      executingFunction={executingFunction}
                      filesLength={files.length}
                      onSettings={() => {}}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <DocumentationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

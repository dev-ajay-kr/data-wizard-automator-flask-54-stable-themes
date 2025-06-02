
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, TrendingUp, Eye, Play, Loader2 } from 'lucide-react';
import { useFiles } from '@/contexts/FileContext';
import { useGemini } from '@/hooks/useGemini';
import { ResponseFormatter } from './ResponseFormatter';
import { processFileDataForAnalysis } from './functions/utils';

interface AnalysisResult {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export const AnalysisFunctions: React.FC = () => {
  const { files, getParsedData } = useFiles();
  const { callGemini, isLoading } = useGemini();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeFunction, setActiveFunction] = useState<string>('');

  const analysisFunctions = [
    {
      id: 'csv-structure',
      title: 'Analyze CSV Structure',
      description: 'Analyze columns, data types, and relationships',
      category: 'analysis',
      prompt: 'Analyze the structure of the uploaded CSV data. Provide detailed information about columns, data types, potential relationships, data quality issues, and recommendations for data processing.'
    },
    {
      id: 'calculated-columns',
      title: 'Suggest Calculated Columns',
      description: 'Identify potential derived metrics',
      category: 'analysis',
      prompt: 'Based on the uploaded data, suggest useful calculated columns and derived metrics that could provide additional insights. Include formulas and business value explanations.'
    },
    {
      id: 'analyze-all',
      title: 'Analyze All CSV Files',
      description: 'Comprehensive analysis of all uploaded data',
      category: 'analysis',
      prompt: 'Perform a comprehensive analysis of all uploaded CSV files. Include data summary, patterns, correlations, outliers, and actionable insights.'
    },
    {
      id: 'suggest-dashboards',
      title: 'Suggest Dashboards',
      description: 'Get recommendations for data visualization',
      category: 'visualization',
      prompt: 'Based on the uploaded data, suggest effective dashboard layouts and visualization types. Include specific chart recommendations and key metrics to track.'
    },
    {
      id: 'dashboard-preview',
      title: 'Dashboard Preview',
      description: 'Preview dashboards with actual data charts',
      category: 'visualization',
      prompt: 'Create a detailed dashboard preview using the uploaded data. Suggest specific visualizations with chart types, axes, and filtering options.'
    },
    {
      id: 'identify-trends',
      title: 'Identify Trends',
      description: 'Discover patterns and anomalies in your data',
      category: 'visualization',
      prompt: 'Analyze the uploaded data to identify trends, patterns, seasonal variations, and anomalies. Provide statistical insights and visual representation suggestions.'
    },
    {
      id: 'db-structure',
      title: 'Get DB Structure',
      description: 'Analyze database schema and relationships',
      category: 'schema',
      prompt: 'Analyze the uploaded data as if it were database tables. Suggest optimal database schema, relationships, indexes, and normalization recommendations.'
    }
  ];

  const runAnalysis = async (func: typeof analysisFunctions[0]) => {
    if (files.length === 0) {
      const errorResult: AnalysisResult = {
        id: `error-${Date.now()}`,
        title: func.title,
        content: '⚠️ **No Data Available**\n\nPlease upload CSV files first to run this analysis.',
        timestamp: new Date()
      };
      setResults(prev => [errorResult, ...prev]);
      return;
    }

    setActiveFunction(func.id);
    
    try {
      const fileContext = processFileDataForAnalysis(files);
      const response = await callGemini(func.prompt, fileContext);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const result: AnalysisResult = {
        id: `${func.id}-${Date.now()}`,
        title: func.title,
        content: response.text || 'No analysis results generated.',
        timestamp: new Date()
      };

      setResults(prev => [result, ...prev]);
    } catch (error: any) {
      console.error('Analysis error:', error);
      const errorResult: AnalysisResult = {
        id: `error-${Date.now()}`,
        title: func.title,
        content: `## ⚠️ **Analysis Error**\n\n${error.message}\n\nPlease check your API key configuration and try again.`,
        timestamp: new Date()
      };
      setResults(prev => [errorResult, ...prev]);
    } finally {
      setActiveFunction('');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis': return <Database className="w-4 h-4" />;
      case 'visualization': return <BarChart className="w-4 h-4" />;
      case 'schema': return <TrendingUp className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'visualization': return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20';
      case 'schema': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const groupedFunctions = analysisFunctions.reduce((acc, func) => {
    if (!acc[func.category]) {
      acc[func.category] = [];
    }
    acc[func.category].push(func);
    return acc;
  }, {} as Record<string, typeof analysisFunctions>);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Datasource Utilities</h2>
            <p className="text-gray-600 dark:text-gray-400">Powerful tools for data analysis and insights generation using your uploaded data</p>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20">
            {files.length} Files Loaded
          </Badge>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Analysis Functions
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Visualization Functions
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Schema Functions
            </TabsTrigger>
          </TabsList>

          {Object.entries(groupedFunctions).map(([category, functions]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {functions.map((func) => (
                  <Card
                    key={func.id}
                    className={`p-4 transition-all hover-scale cursor-pointer ${getCategoryColor(category)} border-2`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(category)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {func.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {func.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => runAnalysis(func)}
                      disabled={isLoading && activeFunction === func.id}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading && activeFunction === func.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run
                        </>
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Analysis Results */}
      {results.length > 0 && (
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {results.map((result) => (
                <Card key={result.id} className="p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.title}
                    </h3>
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
                      {result.timestamp.toLocaleTimeString()}
                    </Badge>
                  </div>
                  
                  <ResponseFormatter
                    content={result.content}
                    enableExports={true}
                    title={`${result.title.replace(/\s+/g, '_')}_${result.id}`}
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

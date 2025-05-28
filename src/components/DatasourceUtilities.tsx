
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, BarChart, Calculator, Search, TrendingUp, Table, ChevronDown, ChevronRight, Eye, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';

export const DatasourceUtilities: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [dashboardCharts, setDashboardCharts] = useState<any[]>([]);
  const { toast } = useToast();
  const { files } = useFiles();

  const utilities = [
    {
      id: 'analyze-structure',
      title: 'Analyze CSV Structure',
      description: 'Analyze columns, data types, and relationships',
      icon: Database,
      color: 'bg-blue-500',
      category: 'analysis'
    },
    {
      id: 'calculated-columns',
      title: 'Suggest Calculated Columns',
      description: 'Identify potential derived metrics',
      icon: Calculator,
      color: 'bg-purple-500',
      category: 'analysis'
    },
    {
      id: 'analyze-all',
      title: 'Analyze All CSV Files',
      description: 'Comprehensive analysis of all uploaded data',
      icon: Search,
      color: 'bg-red-500',
      category: 'analysis'
    },
    {
      id: 'suggest-dashboards',
      title: 'Suggest Dashboards',
      description: 'Get recommendations for data visualization',
      icon: BarChart,
      color: 'bg-green-500',
      category: 'visualization'
    },
    {
      id: 'dashboard-preview',
      title: 'Dashboard Preview',
      description: 'Preview dashboards with actual data charts',
      icon: BarChart,
      color: 'bg-indigo-500',
      category: 'visualization'
    },
    {
      id: 'trends',
      title: 'Identify Trends',
      description: 'Discover patterns and anomalies in your data',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      category: 'visualization'
    },
    {
      id: 'db-structure',
      title: 'Get DB Structure',
      description: 'Analyze database schema and relationships',
      icon: Table,
      color: 'bg-orange-500',
      category: 'schema'
    }
  ];

  const callGeminiAPI = async (prompt: string, fileContext: string) => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set it in the chat interface.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt}\n\nData Context:\n${fileContext}\n\nPlease provide a structured JSON response.`
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const exportToExcel = async (data: any, filename: string) => {
    // This would typically use a library like xlsx
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportChartAsPNG = async (chartId: string, filename: string) => {
    // This would capture the chart as PNG
    toast({
      title: "Export Started",
      description: `Exporting ${filename} as PNG...`,
    });
  };

  const convertToCSV = (data: any) => {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ];
      return csvRows.join('\n');
    }
    return JSON.stringify(data, null, 2);
  };

  const toggleSection = (category: string) => {
    setCollapsedSections(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleUtilityAction = async (utilityId: string) => {
    if (files.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload CSV files first to analyze data.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setSelectedUtility(utilityId);
    
    try {
      const fileContext = files.map(file => {
        const preview = file.preview?.slice(0, 10).map(row => row.join(',')).join('\n') || '';
        return `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\nPreview:\n${preview}`;
      }).join('\n\n');

      let prompt = '';
      switch (utilityId) {
        case 'analyze-structure':
          prompt = 'Analyze the CSV structure and provide detailed information about columns, data types, null values, and data quality metrics. Return results in JSON format with columns array containing name, type, nullCount, and sampleValues.';
          break;
        case 'calculated-columns':
          prompt = 'Based on the CSV data, suggest calculated columns that could provide valuable insights. Include formulas and business reasoning. Return as JSON with suggestions array containing name, formula, description, and businessValue.';
          break;
        case 'analyze-all':
          prompt = 'Perform comprehensive analysis of all CSV files including relationships between files, data quality assessment, and key insights. Return structured JSON results.';
          break;
        case 'suggest-dashboards':
          prompt = 'Suggest dashboard layouts and chart types that would be most effective for this data. Include specific column recommendations for each chart. Return JSON with dashboards array containing title, charts array with type, columns, and reasoning.';
          break;
        case 'dashboard-preview':
          prompt = 'Create dashboard preview with actual data points for visualization. Provide chart configurations with real data samples for preview. Return JSON with charts array containing type, data points, labels, and configuration.';
          break;
        case 'trends':
          prompt = 'Identify trends, patterns, and anomalies in the data. Look for seasonal patterns, growth trends, and outliers. Return JSON with trends array containing metric, direction, confidence, and description.';
          break;
        case 'db-structure':
          prompt = 'Analyze the data structure as if it were database tables. Identify potential relationships, foreign keys, and normalization opportunities. Return JSON with tables, relationships, and recommendations.';
          break;
        default:
          prompt = 'Analyze the provided data and return insights in JSON format.';
      }

      const response = await callGeminiAPI(prompt, fileContext);
      
      // Try to parse JSON response, fallback to structured text
      let parsedResults;
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        parsedResults = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: response };
      } catch {
        parsedResults = { analysis: response, raw: true };
      }

      setAnalysisResults({
        title: utilities.find(u => u.id === utilityId)?.title || 'Analysis Results',
        type: utilityId,
        data: parsedResults,
        timestamp: new Date().toISOString()
      });

      if (utilityId === 'dashboard-preview' && parsedResults.charts) {
        setDashboardCharts(parsedResults.charts);
      }

      toast({
        title: "Analysis Complete",
        description: `${utilities.find(u => u.id === utilityId)?.title} has been completed using your uploaded data.`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze data. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = Array.from(new Set(utilities.map(u => u.category)));

  const renderResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{analysisResults.title}</h4>
            <p className="text-sm text-gray-500">Analyzed {files.length} file(s)</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => exportToExcel(analysisResults.data, analysisResults.title)}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Excel
            </Button>
            {dashboardCharts.length > 0 && (
              <Button 
                onClick={() => exportChartAsPNG('dashboard', 'dashboard')}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                PNG
              </Button>
            )}
          </div>
        </div>

        {analysisResults.data.raw ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{analysisResults.data.analysis}</pre>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisResults.data.columns && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Column Analysis</h5>
                <div className="grid grid-cols-1 gap-2">
                  {analysisResults.data.columns.map((col: any, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{col.name}</span>
                        <Badge variant="outline">{col.type}</Badge>
                      </div>
                      {col.nullCount > 0 && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {col.nullCount} null values
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResults.data.suggestions && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Suggested Calculations</h5>
                <div className="space-y-3">
                  {analysisResults.data.suggestions.map((suggestion: any, index: number) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border">
                      <h6 className="font-medium text-blue-900 dark:text-blue-100">{suggestion.name}</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{suggestion.description}</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {suggestion.formula}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResults.data.dashboards && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Dashboard Suggestions</h5>
                <div className="grid grid-cols-1 gap-3">
                  {analysisResults.data.dashboards.map((dashboard: any, index: number) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded border">
                      <h6 className="font-medium text-green-900 dark:text-green-100">{dashboard.title}</h6>
                      <div className="mt-2 space-y-1">
                        {dashboard.charts?.map((chart: any, chartIndex: number) => (
                          <div key={chartIndex} className="text-sm">
                            <span className="font-medium">{chart.type}:</span> {chart.columns?.join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashboardCharts.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Dashboard Preview</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardCharts.map((chart: any, index: number) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                      <h6 className="font-medium mb-2">{chart.title || `Chart ${index + 1}`}</h6>
                      <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                        <div className="text-center">
                          <BarChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">{chart.type} Chart Preview</p>
                          <p className="text-xs text-gray-400">Data: {chart.dataPoints} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Datasource Utilities
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Powerful tools for data analysis and insights generation using your uploaded data</p>
        {files.length > 0 && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {files.length} file(s) uploaded - Ready for analysis
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functions Panel - Left Side */}
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryUtilities = utilities.filter(u => u.category === category);
            const isCollapsed = collapsedSections.includes(category);
            
            return (
              <Card key={category} className="overflow-hidden">
                <div 
                  className="p-4 bg-gray-50 dark:bg-gray-800 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleSection(category)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{category} Functions</h3>
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    {categoryUtilities.map((utility) => {
                      const IconComponent = utility.icon;
                      return (
                        <div key={utility.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className={`w-8 h-8 rounded-lg ${utility.color} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{utility.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{utility.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              onClick={() => handleUtilityAction(utility.id)}
                              disabled={isAnalyzing || files.length === 0}
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1 h-7"
                            >
                              {isAnalyzing && selectedUtility === utility.id ? 'Running...' : 'Run'}
                            </Button>
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 h-7"
                              onClick={() => setSelectedUtility(utility.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Preview Panel - Right Side */}
        <div className="space-y-4">
          <Card className="h-full">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analysis Results</h3>
            </div>
            
            <ScrollArea className="h-96">
              <div className="p-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Analysis in Progress</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processing your data with Gemini AI...</p>
                    </div>
                  </div>
                ) : analysisResults ? (
                  renderResults()
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Database className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-center">
                      {files.length === 0 
                        ? 'Upload CSV files and run analysis functions to see results here'
                        : 'Select and run a utility function to analyze your uploaded data'
                      }
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

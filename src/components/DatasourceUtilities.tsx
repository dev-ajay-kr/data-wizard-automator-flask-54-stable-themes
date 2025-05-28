
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, BarChart, Calculator, Search, TrendingUp, Table, ChevronDown, ChevronRight, Eye, Download, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { useGemini } from '@/hooks/useGemini';
import { ResponseFormatter } from './ResponseFormatter';
import { ChartVisualization } from './ChartVisualization';

export const DatasourceUtilities: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [dashboardCharts, setDashboardCharts] = useState<any[]>([]);
  const { toast } = useToast();
  const { files, getParsedData } = useFiles();
  const { callGemini, isLoading: geminiLoading } = useGemini();

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
      const parsedData = getParsedData();
      const fileContext = files.map(file => {
        const basicInfo = `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes`;
        
        if (file.parsedData && file.parsedData.length > 0) {
          const sampleData = file.parsedData.slice(0, 5);
          const columns = Object.keys(file.parsedData[0]);
          return `${basicInfo}\nRows: ${file.parsedData.length}\nColumns: [${columns.join(', ')}]\nSample Data:\n${JSON.stringify(sampleData, null, 2)}`;
        }
        return basicInfo;
      }).join('\n\n');

      let prompt = '';
      switch (utilityId) {
        case 'dashboard-preview':
          prompt = `Based on the uploaded data, create actual dashboard charts with real data samples. 
          For each chart, provide:
          - Chart type (bar, line, pie, area)
          - Title for the chart
          - Actual data points from the uploaded files (at least 5-10 points)
          - X and Y axis keys
          
          Return a JSON response with this structure:
          {
            "summary": "Dashboard preview with X charts created",
            "charts": [
              {
                "type": "bar",
                "title": "Chart Title",
                "data": [{"name": "Item1", "value": 100}, ...],
                "xKey": "name",
                "yKey": "value"
              }
            ],
            "insights": "Key insights about the visualizations"
          }
          
          Use actual column names and data from the uploaded files.`;
          break;
        case 'analyze-structure':
          prompt = `Analyze the CSV structure in detail. Provide:
          ## Data Structure Analysis
          
          ### File Overview
          - File count: X
          - Total rows: X
          - Data quality score: X/10
          
          ### Column Analysis
          | Column Name | Data Type | Null Count | Sample Values |
          |-------------|-----------|------------|---------------|
          
          ### Data Quality Issues
          - **Missing Values**: X% of data
          - **Duplicates**: X records
          - **Inconsistent Formats**: Details
          
          ### Recommendations
          1. **Priority fixes**
          2. **Data transformation suggestions**
          3. **Quality improvement steps**`;
          break;
        default:
          prompt = `Analyze the provided data for ${utilities.find(u => u.id === utilityId)?.title}. 
          Provide structured analysis with headers, tables, bullet points, and actionable insights.
          Use markdown formatting with proper headers (##, ###), tables (|), lists (-), and emphasis (**bold**, *italic*).`;
      }

      const response = await callGemini(prompt, fileContext);
      
      if (response.error) {
        throw new Error(response.error);
      }

      let parsedResults;
      let charts = [];

      // Special handling for dashboard preview
      if (utilityId === 'dashboard-preview') {
        try {
          const jsonMatch = response.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResults = JSON.parse(jsonMatch[0]);
            if (parsedResults.charts) {
              charts = parsedResults.charts.map((chart: any) => ({
                type: chart.type || 'bar',
                title: chart.title || 'Untitled Chart',
                data: chart.data || [],
                xKey: chart.xKey || 'name',
                yKey: chart.yKey || 'value'
              }));
            }
          }
        } catch (e) {
          // Fallback: create sample charts from actual data
          const sampleData = parsedData.slice(0, 10);
          if (sampleData.length > 0) {
            const numericColumns = Object.keys(sampleData[0]).filter(key => 
              !isNaN(Number(sampleData[0][key]))
            );
            const textColumns = Object.keys(sampleData[0]).filter(key => 
              isNaN(Number(sampleData[0][key]))
            );

            if (numericColumns.length > 0 && textColumns.length > 0) {
              charts = [{
                type: 'bar',
                title: `${numericColumns[0]} by ${textColumns[0]}`,
                data: sampleData.map((item, index) => ({
                  name: item[textColumns[0]] || `Item ${index + 1}`,
                  value: Number(item[numericColumns[0]]) || 0
                })),
                xKey: 'name',
                yKey: 'value'
              }];
            }
          }
        }
      }

      setAnalysisResults({
        title: utilities.find(u => u.id === utilityId)?.title || 'Analysis Results',
        type: utilityId,
        content: response.text,
        timestamp: new Date().toISOString(),
        hasCharts: charts.length > 0
      });

      setDashboardCharts(charts);

      toast({
        title: "Analysis Complete",
        description: `${utilities.find(u => u.id === utilityId)?.title} completed successfully.`,
      });
    } catch (error: any) {
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

  const exportToExcel = async (data: any, filename: string) => {
    const csvContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Results exported as ${filename}.csv`,
    });
  };

  const exportChartAsPNG = async (chartId: string, filename: string) => {
    toast({
      title: "PNG Export",
      description: "Chart export as PNG is coming soon! Use Excel export for now.",
    });
  };

  const toggleSection = (category: string) => {
    setCollapsedSections(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = Array.from(new Set(utilities.map(u => u.category)));

  const renderResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{analysisResults.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Analyzed {files.length} file(s) • {getParsedData().length} total rows
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => exportToExcel(analysisResults.content, analysisResults.title)}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export
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

        {dashboardCharts.length > 0 && (
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Interactive Dashboard Preview
            </h5>
            <ChartVisualization charts={dashboardCharts} />
          </div>
        )}

        <div className="space-y-4">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Analysis Results
          </h5>
          <Card className="p-6 bg-gray-50 dark:bg-gray-800">
            <ResponseFormatter content={analysisResults.content} />
          </Card>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          Generated at: {new Date(analysisResults.timestamp).toLocaleString()}
        </div>
      </div>
    );
  };

  // Check if API key is available
  const apiKey = localStorage.getItem('gemini_api_key');
  const showApiKeyWarning = !apiKey;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Datasource Utilities
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced data analysis and visualization tools powered by AI
            </p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex flex-wrap gap-3">
          {showApiKeyWarning ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                API Key Required
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Gemini AI Ready
              </span>
            </div>
          )}
          
          {files && files.length > 0 ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {files.length} file(s) • {getParsedData().length} rows ready
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                No files uploaded
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Functions Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Available Functions
          </h3>
          
          {categories.map((category) => {
            const categoryUtilities = utilities.filter(u => u.category === category);
            const isCollapsed = collapsedSections.includes(category);
            
            return (
              <Card key={category} className="overflow-hidden shadow-sm">
                <div 
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                  onClick={() => toggleSection(category)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize flex items-center gap-2">
                      {category === 'analysis' && <Search className="w-4 h-4" />}
                      {category === 'visualization' && <BarChart className="w-4 h-4" />}
                      {category === 'schema' && <Table className="w-4 h-4" />}
                      {category} Functions
                    </h4>
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    {categoryUtilities.map((utility) => {
                      const IconComponent = utility.icon;
                      return (
                        <div key={utility.id} className="group flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200">
                          <div className={`w-12 h-12 rounded-xl ${utility.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {utility.title}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {utility.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              onClick={() => handleUtilityAction(utility.id)}
                              disabled={isAnalyzing || files.length === 0 || !apiKey}
                              size="sm"
                              className="text-xs px-4 py-2 h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            >
                              {isAnalyzing && selectedUtility === utility.id ? (
                                <span className="flex items-center gap-1">
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  Running...
                                </span>
                              ) : (
                                'Run Analysis'
                              )}
                            </Button>
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-xs px-3 py-1 h-6 text-gray-500 hover:text-gray-700"
                              onClick={() => setSelectedUtility(utility.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Details
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

        {/* Results Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Analysis Results
          </h3>
          
          <Card className="h-[calc(100vh-300px)] shadow-sm">
            <ScrollArea className="h-full">
              <div className="p-6">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        AI Analysis in Progress
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Processing your data with advanced AI algorithms...
                      </p>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {utilities.find(u => u.id === selectedUtility)?.title}
                      </div>
                    </div>
                  </div>
                ) : analysisResults ? (
                  renderResults()
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Database className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Ready for Analysis
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                        {files.length === 0 
                          ? 'Upload CSV files and run analysis functions to see detailed results with interactive visualizations'
                          : 'Select and run a utility function to analyze your uploaded data with AI-powered insights'
                        }
                      </p>
                    </div>
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

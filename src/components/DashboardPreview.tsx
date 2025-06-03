import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartVisualization } from '@/components/ChartVisualization';
import { BarChart3, TrendingUp, PieChart, Activity, RefreshCw, Sparkles } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useFiles } from '@/contexts/FileContext';

interface ChartSuggestion {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  description: string;
}

export const DashboardPreview: React.FC = () => {
  const { files } = useFiles();
  const { callGemini, isLoading } = useGemini();
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const generateDashboard = async () => {
    if (files.length === 0) return;

    setAnalyzing(true);
    try {
      // Prepare file context for Gemini
      const fileContext = files.map(file => {
        if (file.parsedData && file.parsedData.length > 0) {
          const sampleData = file.parsedData.slice(0, 50); // First 50 rows for analysis
          const columns = Object.keys(file.parsedData[0]);
          return {
            fileName: file.name,
            columns: columns,
            rowCount: file.parsedData.length,
            sampleData: sampleData
          };
        }
        return null;
      }).filter(Boolean);

      const prompt = `
        Analyze the provided dataset(s) and suggest 4-6 different chart visualizations that would provide meaningful insights. 
        
        For each chart suggestion, provide:
        1. Chart type (bar, line, pie, or area)
        2. Chart title
        3. X-axis column name
        4. Y-axis column name  
        5. Brief description of insights
        6. Actual data points (up to 10-15 data points per chart)
        
        Please respond in this exact JSON format:
        {
          "suggestions": [
            {
              "type": "bar",
              "title": "Chart Title",
              "xKey": "column_name",
              "yKey": "column_name",
              "description": "Brief insight description",
              "data": [
                {"column_name": "value1", "column_name": 123},
                {"column_name": "value2", "column_name": 456}
              ]
            }
          ]
        }
        
        Make sure the data points are real values from the dataset, not mock data.
        Choose the most insightful combinations of columns for visualization.
        Ensure data types are appropriate (numeric for Y-axis, categorical/date for X-axis).
      `;

      const result = await callGemini(prompt, JSON.stringify(fileContext, null, 2));
      
      // Parse Gemini response - fix the TypeScript error
      try {
        // Convert GeminiResponse to string and extract JSON
        const responseText = typeof result === 'string' ? result : result.text || JSON.stringify(result);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            setChartSuggestions(parsed.suggestions);
          }
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        // Fallback: create basic suggestions from data
        createFallbackSuggestions();
      }
    } catch (error) {
      console.error('Error generating dashboard:', error);
      createFallbackSuggestions();
    } finally {
      setAnalyzing(false);
    }
  };

  const createFallbackSuggestions = () => {
    if (files.length === 0 || !files[0].parsedData) return;

    const data = files[0].parsedData.slice(0, 15);
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      data.some(row => !isNaN(Number(row[col])) && row[col] !== '')
    );
    const textColumns = columns.filter(col => !numericColumns.includes(col));

    const suggestions: ChartSuggestion[] = [];

    if (numericColumns.length >= 2) {
      suggestions.push({
        type: 'bar',
        title: `${numericColumns[0]} Analysis`,
        xKey: textColumns[0] || columns[0],
        yKey: numericColumns[0],
        description: `Distribution of ${numericColumns[0]} across categories`,
        data: data.slice(0, 10).map(row => ({
          [textColumns[0] || columns[0]]: row[textColumns[0] || columns[0]],
          [numericColumns[0]]: Number(row[numericColumns[0]]) || 0
        }))
      });
    }

    if (numericColumns.length >= 1) {
      suggestions.push({
        type: 'line',
        title: `${numericColumns[0]} Trend`,
        xKey: textColumns[0] || columns[0],
        yKey: numericColumns[0],
        description: `Trend analysis of ${numericColumns[0]}`,
        data: data.slice(0, 12).map(row => ({
          [textColumns[0] || columns[0]]: row[textColumns[0] || columns[0]],
          [numericColumns[0]]: Number(row[numericColumns[0]]) || 0
        }))
      });
    }

    setChartSuggestions(suggestions);
  };

  useEffect(() => {
    if (files.length > 0) {
      generateDashboard();
    }
  }, [files]);

  if (files.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg animate-fade-in">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-pulse" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Data Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload CSV files to see AI-generated dashboard suggestions with real data visualizations
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with enhanced animations */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold animate-slide-in-left">AI-Generated Dashboard</h2>
              <p className="text-blue-100 animate-slide-in-left animation-delay-200">
                Smart visualizations based on your data with real insights from Gemini AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 animate-slide-in-right">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover-scale">
              {files.length} file(s) analyzed
            </Badge>
            <Button
              onClick={generateDashboard}
              disabled={analyzing || isLoading}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover-scale"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State with enhanced animation */}
      {analyzing && (
        <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg animate-scale-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="animate-fade-in animation-delay-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analyzing Your Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gemini AI is creating intelligent dashboard suggestions...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Suggestions with staggered animations */}
      {!analyzing && chartSuggestions.length > 0 && (
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg animate-scale-in">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Suggested Dashboard ({chartSuggestions.length} charts)
            </h3>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {chartSuggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className="p-4 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs hover-scale">
                        {suggestion.type.toUpperCase()}
                      </Badge>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Activity className="w-3 h-3" />
                      {suggestion.data.length} points
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {suggestion.description}
                  </p>

                  <ChartVisualization
                    charts={[{
                      type: suggestion.type,
                      title: suggestion.title,
                      data: suggestion.data,
                      xKey: suggestion.xKey,
                      yKey: suggestion.yKey,
                      id: `dashboard-chart-${index}`
                    }]}
                    className="mb-0"
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* No Suggestions State */}
      {!analyzing && chartSuggestions.length === 0 && files.length > 0 && (
        <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg animate-scale-in">
          <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Generate Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Could not analyze the data for chart suggestions. Please ensure your CSV files have proper column headers and numeric data.
          </p>
          <Button onClick={generateDashboard} variant="outline" className="hover-scale">
            Try Again
          </Button>
        </Card>
      )}
    </div>
  );
};

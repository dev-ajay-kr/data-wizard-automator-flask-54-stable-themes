
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, BarChart, Calculator, Search, TrendingUp, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DatasourceUtilities: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const utilities = [
    {
      id: 'analyze-structure',
      title: 'Analyze CSV Structure',
      description: 'Analyze columns, data types, and relationships',
      icon: Database,
      color: 'bg-blue-500'
    },
    {
      id: 'suggest-dashboards',
      title: 'Suggest Dashboards',
      description: 'Get recommendations for data visualization',
      icon: BarChart,
      color: 'bg-green-500'
    },
    {
      id: 'calculated-columns',
      title: 'Suggest Calculated Columns',
      description: 'Identify potential derived metrics',
      icon: Calculator,
      color: 'bg-purple-500'
    },
    {
      id: 'db-structure',
      title: 'Get DB Structure',
      description: 'Analyze database schema and relationships',
      icon: Table,
      color: 'bg-orange-500'
    },
    {
      id: 'analyze-all',
      title: 'Analyze All CSV Files',
      description: 'Comprehensive analysis of all uploaded data',
      icon: Search,
      color: 'bg-red-500'
    },
    {
      id: 'trends',
      title: 'Identify Trends',
      description: 'Discover patterns and anomalies in your data',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ];

  const handleUtilityAction = async (utilityId: string) => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockResults = {
        'analyze-structure': {
          title: 'CSV Structure Analysis',
          data: {
            totalColumns: 12,
            totalRows: 1547,
            columnTypes: {
              numeric: 6,
              text: 4,
              date: 2
            },
            dataQuality: {
              completeness: 94.5,
              uniqueness: 87.2,
              validity: 91.8
            }
          }
        },
        'suggest-dashboards': {
          title: 'Dashboard Recommendations',
          data: {
            recommended: [
              { type: 'Time Series Chart', confidence: 95, reason: 'Date columns detected with temporal patterns' },
              { type: 'KPI Dashboard', confidence: 88, reason: 'Multiple numeric metrics available' },
              { type: 'Correlation Matrix', confidence: 82, reason: 'Strong correlations between variables' }
            ]
          }
        },
        'calculated-columns': {
          title: 'Calculated Column Suggestions',
          data: {
            suggestions: [
              { name: 'Revenue_Growth_Rate', formula: '(Current_Revenue - Previous_Revenue) / Previous_Revenue * 100', impact: 'High' },
              { name: 'Customer_Lifetime_Value', formula: 'Average_Order_Value * Purchase_Frequency * Customer_Lifespan', impact: 'High' },
              { name: 'Efficiency_Ratio', formula: 'Output_Value / Input_Cost', impact: 'Medium' }
            ]
          }
        }
      };

      setAnalysisResults(mockResults[utilityId] || {
        title: 'Analysis Complete',
        data: { message: 'Analysis completed successfully. Results will be available shortly.' }
      });
      
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `${utilities.find(u => u.id === utilityId)?.title} has been completed.`,
      });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Datasource Utilities
        </h2>
        <p className="text-gray-600">Powerful tools for data analysis and insights generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {utilities.map((utility) => {
          const IconComponent = utility.icon;
          return (
            <Card key={utility.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${utility.color} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{utility.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{utility.description}</p>
                  <Button 
                    onClick={() => handleUtilityAction(utility.id)}
                    disabled={isAnalyzing}
                    size="sm"
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {isAnalyzing && (
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="font-semibold text-gray-900">Analysis in Progress</h3>
              <p className="text-sm text-gray-600">Processing your data and generating insights...</p>
            </div>
          </div>
        </Card>
      )}

      {analysisResults && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{analysisResults.title}</h3>
          
          {analysisResults.data.totalColumns && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Total Columns</h4>
                <p className="text-2xl font-bold text-blue-600">{analysisResults.data.totalColumns}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Total Rows</h4>
                <p className="text-2xl font-bold text-green-600">{analysisResults.data.totalRows.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900">Data Quality</h4>
                <p className="text-2xl font-bold text-purple-600">{analysisResults.data.dataQuality.completeness}%</p>
              </div>
            </div>
          )}

          {analysisResults.data.recommended && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recommended Visualizations</h4>
              {analysisResults.data.recommended.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{rec.type}</span>
                    <p className="text-sm text-gray-600">{rec.reason}</p>
                  </div>
                  <Badge variant="secondary">{rec.confidence}% confidence</Badge>
                </div>
              ))}
            </div>
          )}

          {analysisResults.data.suggestions && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Calculated Column Suggestions</h4>
              {analysisResults.data.suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{suggestion.name}</h5>
                    <Badge variant={suggestion.impact === 'High' ? 'default' : 'secondary'}>
                      {suggestion.impact} Impact
                    </Badge>
                  </div>
                  <code className="text-sm text-gray-700 bg-gray-100 p-2 rounded block">
                    {suggestion.formula}
                  </code>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

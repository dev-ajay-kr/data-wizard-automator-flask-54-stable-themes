
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, BarChart, Calculator, Search, TrendingUp, Table, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DatasourceUtilities: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const { toast } = useToast();

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
      id: 'suggest-dashboards',
      title: 'Suggest Dashboards',
      description: 'Get recommendations for data visualization',
      icon: BarChart,
      color: 'bg-green-500',
      category: 'visualization'
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
      id: 'db-structure',
      title: 'Get DB Structure',
      description: 'Analyze database schema and relationships',
      icon: Table,
      color: 'bg-orange-500',
      category: 'schema'
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
      id: 'trends',
      title: 'Identify Trends',
      description: 'Discover patterns and anomalies in your data',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      category: 'visualization'
    }
  ];

  const toggleSection = (category: string) => {
    setCollapsedSections(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleUtilityAction = async (utilityId: string) => {
    setIsAnalyzing(true);
    setSelectedUtility(utilityId);
    
    setTimeout(() => {
      const mockResults = {
        'analyze-structure': {
          title: 'CSV Structure Analysis',
          type: 'structure',
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
            },
            columns: [
              { name: 'ID', type: 'Integer', nulls: 0 },
              { name: 'Name', type: 'String', nulls: 12 },
              { name: 'Amount', type: 'Float', nulls: 3 },
              { name: 'Date', type: 'DateTime', nulls: 0 }
            ]
          }
        },
        'suggest-dashboards': {
          title: 'Dashboard Recommendations',
          type: 'visualization',
          data: {
            recommended: [
              { 
                type: 'Time Series Chart', 
                confidence: 95, 
                reason: 'Date columns detected with temporal patterns',
                chartType: 'line',
                suggestedColumns: ['Date', 'Amount']
              },
              { 
                type: 'KPI Dashboard', 
                confidence: 88, 
                reason: 'Multiple numeric metrics available',
                chartType: 'metric',
                suggestedColumns: ['Amount', 'Count']
              },
              { 
                type: 'Bar Chart', 
                confidence: 82, 
                reason: 'Categorical data with numeric values',
                chartType: 'bar',
                suggestedColumns: ['Category', 'Amount']
              }
            ]
          }
        },
        'trends': {
          title: 'Trend Analysis',
          type: 'visualization',
          data: {
            trends: [
              { metric: 'Revenue Growth', trend: 'increasing', change: '+15.3%' },
              { metric: 'Customer Count', trend: 'stable', change: '+2.1%' },
              { metric: 'Average Order Value', trend: 'decreasing', change: '-5.2%' }
            ],
            patterns: [
              'Strong seasonal pattern in Q4',
              'Weekly cycles with peaks on Fridays',
              'Gradual decline in conversion rates'
            ]
          }
        },
        'db-structure': {
          title: 'Database Schema',
          type: 'schema',
          data: {
            tables: [
              { name: 'customers', rows: 1250, columns: 8 },
              { name: 'orders', rows: 5430, columns: 12 },
              { name: 'products', rows: 340, columns: 6 }
            ],
            relationships: [
              { from: 'orders', to: 'customers', type: 'many-to-one' },
              { from: 'order_items', to: 'orders', type: 'many-to-one' },
              { from: 'order_items', to: 'products', type: 'many-to-one' }
            ]
          }
        }
      };

      setAnalysisResults(mockResults[utilityId] || {
        title: 'Analysis Complete',
        type: 'general',
        data: { message: 'Analysis completed successfully. Results will be available shortly.' }
      });
      
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `${utilities.find(u => u.id === utilityId)?.title} has been completed.`,
      });
    }, 2000);
  };

  const categories = Array.from(new Set(utilities.map(u => u.category)));

  const renderVisualizationPreview = (data: any) => {
    if (data.recommended) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Suggested Charts</h4>
          <div className="grid grid-cols-1 gap-3">
            {data.recommended.map((rec: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-900">{rec.type}</span>
                  </div>
                  <Badge variant="secondary">{rec.confidence}% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                <div className="text-xs text-blue-600">
                  Columns: {rec.suggestedColumns?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.trends) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Trend Analysis</h4>
          <div className="grid grid-cols-1 gap-3">
            {data.trends.map((trend: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{trend.metric}</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${
                      trend.trend === 'increasing' ? 'text-green-500' : 
                      trend.trend === 'decreasing' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      trend.change.startsWith('+') ? 'text-green-600' : 
                      trend.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSchemaPreview = (data: any) => {
    if (data.tables) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Database Schema Map</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.tables.map((table: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Table className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">{table.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Rows: {table.rows.toLocaleString()}</div>
                    <div>Columns: {table.columns}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Relationships</h5>
              <div className="space-y-1">
                {data.relationships.map((rel: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded">
                    {rel.from} → {rel.to} ({rel.type})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Datasource Utilities
        </h2>
        <p className="text-gray-600">Powerful tools for data analysis and insights generation</p>
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
                  className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection(category)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 capitalize">{category} Functions</h3>
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    {categoryUtilities.map((utility) => {
                      const IconComponent = utility.icon;
                      return (
                        <div key={utility.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`w-8 h-8 rounded-lg ${utility.color} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">{utility.title}</h4>
                            <p className="text-xs text-gray-600 truncate">{utility.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              onClick={() => handleUtilityAction(utility.id)}
                              disabled={isAnalyzing}
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
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">Analysis Preview</h3>
            </div>
            
            <ScrollArea className="h-96">
              <div className="p-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900">Analysis in Progress</h4>
                      <p className="text-sm text-gray-600">Processing your data and generating insights...</p>
                    </div>
                  </div>
                ) : analysisResults ? (
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{analysisResults.title}</h4>
                    </div>
                    
                    {analysisResults.type === 'structure' && analysisResults.data.totalColumns && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-medium text-blue-900 text-sm">Total Columns</h5>
                            <p className="text-xl font-bold text-blue-600">{analysisResults.data.totalColumns}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-900 text-sm">Total Rows</h5>
                            <p className="text-xl font-bold text-green-600">{analysisResults.data.totalRows.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Column Details</h5>
                          <div className="space-y-2">
                            {analysisResults.data.columns?.map((col: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{col.name}</span>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">{col.type}</Badge>
                                  {col.nulls > 0 && <Badge variant="destructive" className="text-xs">{col.nulls} nulls</Badge>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {(analysisResults.type === 'visualization') && renderVisualizationPreview(analysisResults.data)}
                    {(analysisResults.type === 'schema') && renderSchemaPreview(analysisResults.data)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Database className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-center">Select and run a utility function to see results here</p>
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

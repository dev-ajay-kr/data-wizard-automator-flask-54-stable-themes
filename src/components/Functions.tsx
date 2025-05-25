import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Play, FileText, Zap, Settings, BookOpen, ChevronDown, ChevronUp, Eye } from 'lucide-react';

export const Functions: React.FC = () => {
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionResult, setFunctionResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(true);

  const etlFunctions = [
    {
      id: 'data-cleansing',
      name: 'Data Cleansing',
      description: 'Remove duplicates, handle missing values, and standardize formats',
      category: 'ETL',
      status: 'active'
    },
    {
      id: 'data-transformation',
      name: 'Data Transformation',
      description: 'Apply business rules and transform data structures',
      category: 'ETL',
      status: 'active'
    },
    {
      id: 'data-validation',
      name: 'Data Validation',
      description: 'Validate data quality and integrity',
      category: 'Quality',
      status: 'active'
    }
  ];

  const analyticsFunctions = [
    {
      id: 'statistical-analysis',
      name: 'Statistical Analysis',
      description: 'Generate descriptive statistics and distributions',
      category: 'Analytics',
      status: 'active'
    },
    {
      id: 'correlation-analysis',
      name: 'Correlation Analysis',
      description: 'Identify relationships between variables',
      category: 'Analytics',
      status: 'active'
    },
    {
      id: 'outlier-detection',
      name: 'Outlier Detection',
      description: 'Detect anomalies and outliers in data',
      category: 'Analytics',
      status: 'beta'
    }
  ];

  const automationFunctions = [
    {
      id: 'schedule-etl',
      name: 'Schedule ETL Jobs',
      description: 'Set up automated data processing pipelines',
      category: 'Automation',
      status: 'active'
    },
    {
      id: 'alert-system',
      name: 'Alert System',
      description: 'Configure alerts for data quality issues',
      category: 'Automation',
      status: 'active'
    },
    {
      id: 'backup-restore',
      name: 'Backup & Restore',
      description: 'Automated backup and restore procedures',
      category: 'Automation',
      status: 'maintenance'
    }
  ];

  const executeFunction = async (functionId: string) => {
    setExecutingFunction(functionId);
    setSelectedFunction(functionId);
    
    // Simulate function execution with mock results
    setTimeout(() => {
      const mockResults = {
        'data-cleansing': {
          title: 'Data Cleansing Results',
          summary: 'Processed 1,547 rows',
          details: {
            duplicatesRemoved: 23,
            missingValuesHandled: 67,
            standardizedFormats: 145,
            qualityScore: 94.2
          },
          logs: [
            'Starting data cleansing process...',
            'Scanning for duplicate records...',
            'Found and removed 23 duplicate entries',
            'Processing missing values...',
            'Applied standardization rules...',
            'Data cleansing completed successfully'
          ]
        },
        'statistical-analysis': {
          title: 'Statistical Analysis Results',
          summary: 'Generated statistics for 12 columns',
          details: {
            numericColumns: 8,
            categoricalColumns: 4,
            correlations: 15,
            distributions: 'Normal, Skewed, Uniform'
          },
          stats: [
            { column: 'Revenue', mean: 45230.15, median: 42100.00, std: 12450.30 },
            { column: 'Orders', mean: 127.8, median: 115.0, std: 34.2 },
            { column: 'Customers', mean: 89.4, median: 87.0, std: 15.6 }
          ]
        },
        'schedule-etl': {
          title: 'ETL Job Scheduled',
          summary: 'Pipeline configured successfully',
          details: {
            frequency: 'Daily at 3:00 AM',
            sources: 3,
            transformations: 7,
            destinations: 2
          },
          schedule: {
            nextRun: '2024-01-15 03:00:00',
            status: 'Active',
            estimatedDuration: '15 minutes'
          }
        }
      };

      setFunctionResult(mockResults[functionId] || {
        title: 'Function Executed',
        summary: 'Function completed successfully',
        details: {}
      });
      
      setExecutingFunction(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const FunctionCard = ({ func }: { func: any }) => (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">{func.name}</h3>
            <Badge className={getStatusColor(func.status) + ' text-xs'}>{func.status}</Badge>
          </div>
          <p className="text-xs text-gray-600 mb-3">{func.description}</p>
          <Badge variant="outline" className="text-xs">{func.category}</Badge>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => executeFunction(func.id)}
          disabled={executingFunction === func.id || func.status === 'maintenance'}
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
          onClick={() => setSelectedFunction(func.id)}
          className="text-xs"
        >
          <Eye className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
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
            <h4 className="font-semibold text-gray-900">Function Executing</h4>
            <p className="text-sm text-gray-600">Processing your request...</p>
          </div>
        </div>
      );
    }

    if (functionResult) {
      return (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-lg font-semibold text-gray-900">{functionResult.title}</h4>
            <p className="text-sm text-gray-600">{functionResult.summary}</p>
          </div>

          {functionResult.details && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Execution Details</h5>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(functionResult.details).map(([key, value]) => (
                  <div key={key} className="bg-white p-2 rounded border">
                    <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="font-medium text-gray-900">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {functionResult.stats && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-3">Statistical Results</h5>
              <div className="space-y-2">
                {functionResult.stats.map((stat: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-900 mb-1">{stat.column}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>Mean: {stat.mean}</div>
                      <div>Median: {stat.median}</div>
                      <div>Std Dev: {stat.std}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {functionResult.schedule && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-3">Schedule Information</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Run:</span>
                  <span className="font-medium">{functionResult.schedule.nextRun}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">{functionResult.schedule.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{functionResult.schedule.estimatedDuration}</span>
                </div>
              </div>
            </div>
          )}

          {functionResult.logs && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Execution Logs</h5>
              <ScrollArea className="h-32">
                <div className="space-y-1">
                  {functionResult.logs.map((log: string, index: number) => (
                    <div key={index} className="text-sm text-gray-600 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Code className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-center">Execute a function to see results and logs here</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Functions
        </h2>
        <p className="text-gray-600">Manage and execute data processing functions and automation workflows</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Function Documentation</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ETL Functions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Data Cleansing</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Purpose:</strong> Removes inconsistencies and errors from datasets
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Input:</strong> CSV file or database table
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Output:</strong> Cleaned dataset with quality report
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Analytics Functions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Statistical Analysis</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Purpose:</strong> Generates comprehensive statistical summaries
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Input:</strong> Numeric datasets
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Output:</strong> Statistical report with mean, median, std dev, etc.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Automation Functions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Schedule ETL Jobs</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Purpose:</strong> Automates data processing workflows
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Input:</strong> Schedule configuration and data sources
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Output:</strong> Automated pipeline with monitoring
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
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Function Preview</h3>
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

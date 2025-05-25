
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, FileText, Zap, Settings, BookOpen } from 'lucide-react';

export const Functions: React.FC = () => {
  const [executingFunction, setExecutingFunction] = useState<string | null>(null);

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
    
    // Simulate function execution
    setTimeout(() => {
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
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{func.name}</h3>
            <Badge className={getStatusColor(func.status)}>{func.status}</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">{func.description}</p>
          <Badge variant="outline" className="text-xs">{func.category}</Badge>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => executeFunction(func.id)}
          disabled={executingFunction === func.id || func.status === 'maintenance'}
          size="sm"
          className="flex-1"
        >
          {executingFunction === func.id ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Executing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute
            </>
          )}
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6" />
          Functions
        </h2>
        <p className="text-gray-600">Manage and execute data processing functions and automation workflows</p>
      </div>

      <Tabs defaultValue="etl" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="etl" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            ETL Functions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="etl" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etlFunctions.map((func) => (
              <FunctionCard key={func.id} func={func} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsFunctions.map((func) => (
              <FunctionCard key={func.id} func={func} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

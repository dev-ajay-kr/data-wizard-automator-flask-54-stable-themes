
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Upload, Database, Settings, Zap, BarChart3, 
  Users, Shield, Key, Download, Brain, Cloud, Bot, 
  TrendingUp, Search, FileText, Monitor, Workflow
} from 'lucide-react';

export const ProjectDocumentation: React.FC = () => {
  const coreFeatures = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat Interface',
      description: 'Interactive conversations with Gemini AI for real-time data analysis and insights',
      capabilities: [
        'Natural language data queries',
        'Intelligent data interpretation',
        'Real-time AI responses',
        'Context-aware analysis',
        'Multi-file data context'
      ]
    },
    {
      icon: Upload,
      title: 'CSV Data Upload & Processing',
      description: 'Advanced file upload with intelligent data parsing and preview',
      capabilities: [
        'Multiple CSV file support',
        'Automatic data type detection',
        'Real-time data preview',
        'File validation and error handling',
        'Data structure analysis'
      ]
    },
    {
      icon: Database,
      title: 'Data Source Utilities',
      description: 'Connect and manage various data sources and external APIs',
      capabilities: [
        'REST API integration',
        'Data source management',
        'Connection testing',
        'Data synchronization',
        'External service connectivity'
      ]
    },
    {
      icon: Settings,
      title: 'ETL Functions Engine',
      description: 'Execute advanced data transformation and analysis functions',
      capabilities: [
        'Data cleansing and validation',
        'Statistical analysis',
        'Correlation analysis',
        'Outlier detection',
        'Automated reporting'
      ]
    }
  ];

  const etlFunctions = [
    { name: 'Data Cleansing', status: 'active', description: 'Remove duplicates, handle missing values, fix inconsistencies' },
    { name: 'Data Transformation', status: 'active', description: 'Transform structure and format for business requirements' },
    { name: 'Data Validation', status: 'beta', description: 'Validate integrity and business rule compliance' },
    { name: 'Statistical Analysis', status: 'active', description: 'Comprehensive statistical analysis and correlations' },
    { name: 'Correlation Analysis', status: 'active', description: 'Analyze relationships between variables' },
    { name: 'Outlier Detection', status: 'beta', description: 'Identify anomalies using advanced methods' },
    { name: 'Schedule ETL Jobs', status: 'active', description: 'Automated ETL workflows and scheduling' },
    { name: 'Data Quality Alerts', status: 'beta', description: 'Intelligent alerts for quality issues' },
    { name: 'Backup & Restore', status: 'maintenance', description: 'Automated backup strategies' }
  ];

  const betaFunctions = [
    {
      category: '🤖 Machine Learning Pipeline',
      functions: [
        'Auto Feature Engineering - Intelligent feature selection',
        'Model Training - Classification, regression, clustering',
        'Performance Evaluation - Cross-validation and metrics',
        'Model Deployment - REST API generation'
      ]
    },
    {
      category: '📈 Real-time Analytics',
      functions: [
        'Stream Processing - Apache Kafka integration',
        'Real-time Dashboards - Live updating charts',
        'Anomaly Detection - Real-time alerts',
        'Performance Monitoring - System health tracking'
      ]
    },
    {
      category: '🔍 Advanced Data Profiling',
      functions: [
        'Data Lineage Tracking - Source to destination mapping',
        'Schema Evolution - Automated schema management',
        'Data Quality Scoring - Comprehensive quality metrics',
        'Sensitivity Detection - PII and sensitive data identification'
      ]
    },
    {
      category: '☁️ Cloud Data Platforms',
      functions: [
        'Multi-Cloud Support - AWS, Azure, GCP integration',
        'Serverless ETL - Auto-scaling data pipelines',
        'Data Lake Management - S3, Azure Data Lake, BigQuery',
        'Cost Optimization - Resource usage analytics'
      ]
    },
    {
      category: '🧠 AI & Intelligence',
      functions: [
        'Intelligent Data Discovery - Auto data mapping',
        'Predictive Analytics - Trend forecasting and capacity planning',
        'Natural Language Interface - Conversational ETL and SQL generation'
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: Key,
      title: 'Advanced API Management',
      description: 'Secure multi-provider API key management with encryption and masking'
    },
    {
      icon: Download,
      title: 'Multi-Format Export',
      description: 'Export results in Excel, PNG, and Text formats with customizable options'
    },
    {
      icon: Monitor,
      title: 'Real-time Processing',
      description: 'Live data processing with progress tracking and error handling'
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'End-to-end encryption, secure storage, and privacy protection'
    },
    {
      icon: Workflow,
      title: 'Automated Workflows',
      description: 'Intelligent workflow automation with scheduling and monitoring'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Machine learning algorithms for predictive analytics and pattern recognition'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Project Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          ETL Hub - Complete Project Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          ETL Hub is a comprehensive data processing platform that combines traditional ETL (Extract, Transform, Load) 
          capabilities with cutting-edge AI and machine learning technologies. Built with React, TypeScript, and Tailwind CSS, 
          it provides an intuitive interface for data analysts, engineers, and business users to process, analyze, and 
          gain insights from their data.
        </p>
      </Card>

      {/* Core Features */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Features</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {feature.description}
                    </p>
                    <ul className="space-y-1">
                      {feature.capabilities.map((capability, idx) => (
                        <li key={idx} className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current ETL Functions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available ETL Functions</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {etlFunctions.map((func, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  {func.name}
                </h4>
                <Badge className={`text-xs ${getStatusColor(func.status)}`}>
                  {func.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {func.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Beta Functions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Advanced Beta Functions
        </h3>
        <div className="grid gap-4">
          {betaFunctions.map((category, index) => (
            <Card key={index} className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {category.category}
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {category.functions.map((func, idx) => (
                  <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{func}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Features */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technical Capabilities</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {technicalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🚀 Getting Started</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Start Steps:</h4>
            <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li><strong>1.</strong> Configure your Gemini API key in Settings</li>
              <li><strong>2.</strong> Upload CSV files using the upload tab</li>
              <li><strong>3.</strong> Execute functions to analyze your data</li>
              <li><strong>4.</strong> Export results in multiple formats</li>
              <li><strong>5.</strong> Use chat interface for interactive exploration</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supported Formats:</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• <strong>Input:</strong> CSV files with automatic parsing</li>
              <li>• <strong>Output:</strong> Excel, PNG charts, Text reports</li>
              <li>• <strong>APIs:</strong> RESTful integration capabilities</li>
              <li>• <strong>Storage:</strong> Local browser storage (secure)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

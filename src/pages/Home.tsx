
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Upload, Database, Settings, BarChart3, Brain, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: 'Chat with Gemini',
      description: 'Get AI-powered insights about your data and ETL processes with advanced formatting support.',
      action: () => navigate('/chat'),
      color: 'bg-blue-500'
    },
    {
      icon: Upload,
      title: 'CSV Upload & Analysis',
      description: 'Upload CSV files and analyze them with built-in chat functionality.',
      action: () => navigate('/?tab=csv-upload'),
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Suggestions',
      description: 'Get intelligent dashboard recommendations based on your data structure.',
      action: () => navigate('/?tab=datasource-utilities'),
      color: 'bg-purple-500'
    },
    {
      icon: Database,
      title: 'Datasource Utilities',
      description: 'Analyze database schemas, suggest utilities, and visualize relationships.',
      action: () => navigate('/?tab=datasource-utilities'),
      color: 'bg-orange-500'
    },
    {
      icon: Brain,
      title: 'Smart Functions',
      description: 'Execute data transformation functions with real-time preview.',
      action: () => navigate('/?tab=functions'),
      color: 'bg-indigo-500'
    },
    {
      icon: GitBranch,
      title: 'ETL Job Scheduling',
      description: 'Schedule and manage ETL jobs to enhance data quality.',
      action: () => navigate('/?tab=functions'),
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ETL Warehousing Automation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your data workflow with AI-powered insights, automated analysis, and intelligent recommendations.
            Upload files, chat with your data, and generate actionable business intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={feature.action}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
                <Button className="mt-4 w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Your Data</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Upload CSV files or connect to your data sources
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-300 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Chat & Analyze</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Use natural language to explore and understand your data
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Generate Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get dashboards, reports, and actionable recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

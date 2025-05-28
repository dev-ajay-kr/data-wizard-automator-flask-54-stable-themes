
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Upload, Database, Settings, BarChart3, Brain, GitBranch, Zap, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: 'Chat with Gemini',
      description: 'Get AI-powered insights about your data and ETL processes with advanced formatting support.',
      action: () => navigate('/chat'),
      color: 'bg-blue-500',
      delay: 'animation-delay-100'
    },
    {
      icon: Upload,
      title: 'CSV Upload & Analysis',
      description: 'Upload CSV files and analyze them with built-in chat functionality.',
      action: () => navigate('/chat?tab=csv-upload'),
      color: 'bg-green-500',
      delay: 'animation-delay-200'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Suggestions',
      description: 'Get intelligent dashboard recommendations based on your data structure.',
      action: () => navigate('/chat?tab=datasource-utilities'),
      color: 'bg-purple-500',
      delay: 'animation-delay-300'
    },
    {
      icon: Database,
      title: 'Datasource Utilities',
      description: 'Analyze database schemas, suggest utilities, and visualize relationships.',
      action: () => navigate('/chat?tab=datasource-utilities'),
      color: 'bg-orange-500',
      delay: 'animation-delay-400'
    },
    {
      icon: Brain,
      title: 'Smart Functions',
      description: 'Execute data transformation functions with real-time preview.',
      action: () => navigate('/chat?tab=functions'),
      color: 'bg-indigo-500',
      delay: 'animation-delay-500'
    },
    {
      icon: GitBranch,
      title: 'ETL Job Scheduling',
      description: 'Schedule and manage ETL jobs to enhance data quality.',
      action: () => navigate('/chat?tab=functions'),
      color: 'bg-teal-500',
      delay: 'animation-delay-600'
    }
  ];

  const stats = [
    { icon: Zap, label: 'Fast Processing', value: '10x Faster', color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Data Accuracy', value: '99.9%', color: 'text-green-600' },
    { icon: Shield, label: 'Secure', value: 'Enterprise', color: 'text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ETL Warehousing Automation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform your data workflow with AI-powered insights, automated analysis, and intelligent recommendations.
            Upload files, chat with your data, and generate actionable business intelligence.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in hover-scale" style={{ animationDelay: `${index * 100}ms` }}>
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in hover-scale border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${feature.delay}`}
              onClick={feature.action}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${feature.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </CardDescription>
                <Button className="w-full group-hover:bg-blue-600 transition-colors" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl animate-slide-in-right">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Quick Start Guide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Your Data',
                description: 'Upload CSV files or connect to your data sources',
                color: 'bg-blue-500'
              },
              {
                step: '2', 
                title: 'Chat & Analyze',
                description: 'Use natural language to explore and understand your data',
                color: 'bg-green-500'
              },
              {
                step: '3',
                title: 'Generate Insights',
                description: 'Get dashboards, reports, and actionable recommendations',
                color: 'bg-purple-500'
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-scale-in hover-scale" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`${item.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-3 text-lg">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Upload, Database, Settings, Zap, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';
import { useFiles } from '@/contexts/FileContext';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ApiKeyManager } from '@/components/ApiKeyManager';

const Home = () => {
  const { files } = useFiles();

  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat',
      description: 'Interactive conversations with Gemini AI for data analysis and insights',
      link: '/chat',
      color: 'bg-blue-500'
    },
    {
      icon: Upload,
      title: 'CSV Data Upload',
      description: 'Upload and analyze CSV files with intelligent processing',
      link: '/chat?tab=csv-upload',
      color: 'bg-green-500'
    },
    {
      icon: Database,
      title: 'Data Source Utilities',
      description: 'Connect and manage various data sources and APIs',
      link: '/chat?tab=datasource-utilities',
      color: 'bg-purple-500'
    },
    {
      icon: Settings,
      title: 'ETL Functions',
      description: 'Execute advanced data transformation and analysis functions',
      link: '/chat?tab=functions',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Data Files Loaded', value: files.length, icon: Database },
    { label: 'Functions Available', value: '12+', icon: Zap },
    { label: 'Export Formats', value: '4', icon: BarChart3 },
    { label: 'Active Users', value: '1K+', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header with Settings */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ETL Hub
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Your comprehensive platform for data extraction, transformation, and loading with AI-powered insights
                </p>
              </div>
            </div>
            
            {/* Settings Panel in Top Right */}
            <div className="flex items-center gap-3">
              <SettingsPanel />
            </div>
          </div>

          {/* API Key Status */}
          <div className="max-w-4xl mx-auto mb-12">
            <ApiKeyManager />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover-scale hover:shadow-xl transition-all duration-300">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover-scale hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl ${feature.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <Link to={feature.link}>
                      <Button className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                Start by uploading your data files or begin a conversation with our AI assistant
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat?tab=csv-upload">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Data
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              Your data is processed securely and never stored permanently
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

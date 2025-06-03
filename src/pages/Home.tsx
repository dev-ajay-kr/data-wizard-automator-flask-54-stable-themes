
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, MessageSquare, Sparkles, Database, BarChart3, Zap, Bot, Brain } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Smart CSV Upload",
      description: "Upload and parse CSV files with intelligent data type detection",
      delay: "100ms"
    },
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Leverage Gemini AI for advanced data insights and processing",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Dynamic Visualizations",
      description: "Generate interactive charts and dashboards automatically",
      delay: "300ms"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Comprehensive tools for data source management and utilities",
      delay: "400ms"
    },
    {
      icon: Zap,
      title: "Beta Functions",
      description: "Cutting-edge ML pipelines and advanced analytics features",
      delay: "500ms"
    },
    {
      icon: Brain,
      title: "Real-time Processing",
      description: "Stream processing and live data monitoring capabilities",
      delay: "600ms"
    }
  ];

  const quickActions = [
    {
      icon: Upload,
      label: "Upload Data",
      action: () => navigate('/chat?tab=csv-upload'),
      description: "Start by uploading your CSV files"
    },
    {
      icon: MessageSquare,
      label: "Start Chat",
      action: () => navigate('/chat'),
      description: "Interactive AI-powered data analysis"
    },
    {
      icon: Sparkles,
      label: "Try Beta Functions",
      action: () => navigate('/chat?tab=functions'),
      description: "Explore advanced ML and analytics"
    }
  ];

  return (
    <div className="min-h-screen theme-responsive-bg pl-16 md:pl-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Main Hero Content */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium theme-badge animate-pulse-glow"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Data Analytics Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold theme-gradient-text">
                Transform Your Data
              </h1>
              
              <p className="text-xl md:text-2xl theme-text-secondary max-w-3xl mx-auto">
                Harness the power of AI to analyze, visualize, and extract insights from your data with cutting-edge machine learning capabilities
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  size="lg"
                  className="theme-button-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale hover-lift"
                >
                  <action.icon className="w-5 h-5 mr-3" />
                  {action.label}
                </Button>
              ))}
            </div>

            <p className="text-sm theme-text-muted">
              Get started in seconds • No setup required • Powered by Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold theme-text-primary mb-4">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
            Everything you need to analyze, process, and visualize your data with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group theme-card hover-lift p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold theme-text-primary mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="theme-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center p-8 md:p-12 space-y-6 theme-card">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold theme-text-primary">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
              Join thousands of users who are already leveraging AI-powered analytics to make better decisions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/chat?tab=csv-upload')}
              size="lg"
              className="theme-button-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale"
            >
              <Upload className="w-5 h-5 mr-3" />
              Get Started Now
            </Button>
            <Button
              onClick={() => navigate('/chat?tab=functions')}
              size="lg"
              variant="outline"
              className="theme-button-secondary font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Explore Beta Features
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

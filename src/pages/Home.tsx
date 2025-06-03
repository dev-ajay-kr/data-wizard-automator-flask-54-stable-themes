
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, MessageSquare, Sparkles, Database, BarChart3, Settings, Zap, Bot, TrendingUp, FileText, Brain, Cpu } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Smart CSV Upload",
      description: "Upload and parse CSV files with intelligent data type detection",
      color: "from-blue-500 to-cyan-500",
      delay: "100ms"
    },
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Leverage Gemini AI for advanced data insights and processing",
      color: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Dynamic Visualizations",
      description: "Generate interactive charts and dashboards automatically",
      color: "from-green-500 to-emerald-500",
      delay: "300ms"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Comprehensive tools for data source management and utilities",
      color: "from-orange-500 to-red-500",
      delay: "400ms"
    },
    {
      icon: Zap,
      title: "Beta Functions",
      description: "Cutting-edge ML pipelines and advanced analytics features",
      color: "from-yellow-500 to-amber-500",
      delay: "500ms"
    },
    {
      icon: Brain,
      title: "Real-time Processing",
      description: "Stream processing and live data monitoring capabilities",
      color: "from-indigo-500 to-purple-500",
      delay: "600ms"
    }
  ];

  const quickActions = [
    {
      icon: Upload,
      label: "Upload Data",
      action: () => navigate('/chat'),
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Start by uploading your CSV files"
    },
    {
      icon: MessageSquare,
      label: "Start Chat",
      action: () => navigate('/chat'),
      color: "bg-green-600 hover:bg-green-700",
      description: "Interactive AI-powered data analysis"
    },
    {
      icon: Sparkles,
      label: "Try Beta Functions",
      action: () => navigate('/chat'),
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Explore advanced ML and analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full animate-float animation-delay-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full animate-morph"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Main Hero Content */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 animate-pulse-glow"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Data Analytics Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-slide-in-down">
                Transform Your Data
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up animation-delay-200">
                Harness the power of AI to analyze, visualize, and extract insights from your data with cutting-edge machine learning capabilities
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in animation-delay-400">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  size="lg"
                  className={`${action.color} text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale hover-glow button-ripple group animate-slide-in-up`}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <action.icon className="w-5 h-5 mr-3 group-hover:animate-wobble" />
                  {action.label}
                </Button>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in animation-delay-800">
              Get started in seconds • No setup required • Powered by Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to analyze, process, and visualize your data with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover-lift animate-scale-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 group-hover:animate-wobble transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center animate-scale-in glass-effect">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold animate-slide-in-down">
                Ready to Transform Your Data?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto animate-slide-in-up animation-delay-200">
                Join thousands of users who are already leveraging AI-powered analytics to make better decisions
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
              <Button
                onClick={() => navigate('/chat')}
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale border-white hover:border-gray-200 button-ripple"
              >
                <Upload className="w-5 h-5 mr-3" />
                Get Started Now
              </Button>
              <Button
                onClick={() => navigate('/chat')}
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover-scale border-white/50 hover:border-white button-ripple"
              >
                <Sparkles className="w-5 h-5 mr-3" />
                Explore Beta Features
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

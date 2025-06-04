
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Upload, 
  Database, 
  Zap, 
  Settings
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsPanel } from '@/components/SettingsPanel';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();

  // Extract the tab query parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      path: '/chat',
      active: location.pathname === '/chat' && !currentTab
    }
  ];

  const quickActions = [
    {
      icon: Upload,
      label: 'Upload',
      path: '/chat?tab=csv-upload',
      active: currentTab === 'csv-upload',
      mobileLabel: 'CSV'
    },
    {
      icon: Database,
      label: 'Datasource',
      path: '/chat?tab=datasource-utilities',
      active: currentTab === 'datasource-utilities',
      mobileLabel: 'Data'
    },
    {
      icon: Zap,
      label: 'Functions',
      path: '/chat?tab=functions',
      active: currentTab === 'functions',
      mobileLabel: 'Func'
    }
  ];

  const themeClass = `theme-${currentTheme}`;

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b theme-border ${themeClass}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center theme-gradient">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold theme-text-primary hidden sm:block">
                ETLHub
                <Badge variant="outline" className="ml-2 text-xs theme-badge">
                  Beta
                </Badge>
              </h1>
            </div>

            {/* Main Navigation */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-1 theme-button-nav"
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick Actions - Always visible but responsive */}
            <div className="flex items-center gap-1">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(action.path)}
                  className={`flex items-center gap-1 theme-button-secondary ${action.active ? 'theme-button-active' : ''}`}
                  title={action.label}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {action.label}
                  </span>
                  <span className="inline sm:hidden">
                    {action.mobileLabel}
                  </span>
                </Button>
              ))}
            </div>

            {/* Settings Panel */}
            <SettingsPanel />
          </div>
        </div>
      </nav>
    </header>
  );
};


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
  Settings,
  Moon, 
  Sun,
  Menu
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsPanel } from '@/components/SettingsPanel';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

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
      active: location.pathname === '/chat'
    }
  ];

  const quickActions = [
    {
      icon: Upload,
      label: 'Upload',
      action: () => navigate('/chat?tab=csv-upload'),
      variant: 'outline' as const,
      mobileLabel: 'CSV'
    },
    {
      icon: Database,
      label: 'Datasource',
      action: () => navigate('/chat?tab=datasource-utilities'),
      variant: 'outline' as const,
      mobileLabel: 'Data'
    },
    {
      icon: Zap,
      label: 'Functions',
      action: () => navigate('/chat?tab=functions'),
      variant: 'outline' as const,
      mobileLabel: 'Func'
    }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                DataAI
              </h1>
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </div>

            {/* Main Navigation - Hidden on mobile, shown on medium+ screens */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
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
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                  className="flex items-center gap-1 sm:gap-2"
                  title={action.label}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="hidden sm:inline lg:inline">
                    {action.label}
                  </span>
                  <span className="inline sm:hidden">
                    {action.mobileLabel}
                  </span>
                </Button>
              ))}
            </div>

            {/* Mobile Navigation Menu for main nav items */}
            <div className="flex md:hidden items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={`mobile-${item.path}`}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-1"
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center gap-1 sm:gap-2"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {darkMode ? 'Light' : 'Dark'}
              </span>
            </Button>

            {/* Settings Panel */}
            <SettingsPanel />
          </div>
        </div>
      </div>
    </nav>
  );
};


import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Upload, Database, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: Upload, label: 'CSV Upload', path: '/chat?tab=csv-upload' },
  { icon: Database, label: 'Datasource', path: '/chat?tab=datasource-utilities' },
  { icon: Settings, label: 'Functions', path: '/chat?tab=functions' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    if (path === '/chat') return location.pathname === '/chat' && !location.search;
    if (path.includes('?tab=')) {
      const [pathname, search] = path.split('?');
      return location.pathname === pathname && location.search.includes(search);
    }
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    // Ensure chat navigation works from any screen
    if (path === '/chat' || path.startsWith('/chat')) {
      navigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover-scale transition-transform duration-200 hover:scale-105"
            >
              🔧 **ETL Hub**
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative",
                    "hover:bg-gray-100 dark:hover:bg-gray-700 hover-scale",
                    active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 dark:bg-blue-400 animate-scale-in" />
                  )}
                </button>
              );
            })}
          </div>

          {/* API Key Status & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ApiKeyManager compact={true} showTitle={false} className="hidden sm:flex" />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center gap-2 hover-scale"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {darkMode ? 'Light' : 'Dark'}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 min-w-max",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          {/* Mobile API Key Status */}
          <div className="mt-3 sm:hidden">
            <ApiKeyManager compact={true} showTitle={false} />
          </div>
        </div>
      </div>
    </nav>
  );
};

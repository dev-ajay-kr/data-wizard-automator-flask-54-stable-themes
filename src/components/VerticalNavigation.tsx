
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Home, 
  MessageSquare, 
  Upload, 
  Database, 
  Zap, 
  Settings,
  Moon, 
  Sun
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsPanel } from '@/components/SettingsPanel';

const NavigationContent: React.FC = () => {
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
      label: 'Upload CSV',
      action: () => navigate('/chat?tab=csv-upload')
    },
    {
      icon: Database,
      label: 'Datasource',
      action: () => navigate('/chat?tab=datasource-utilities')
    },
    {
      icon: Zap,
      label: 'Functions',
      action: () => navigate('/chat?tab=functions')
    }
  ];

  return (
    <Sidebar className="theme-sidebar">
      <SidebarHeader className="p-4 border-b theme-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold theme-text-primary">DataAI</h1>
            <Badge variant="outline" className="text-xs theme-badge">Beta</Badge>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <div className="space-y-2">
          <div className="px-2 py-1">
            <p className="text-xs font-medium theme-text-secondary group-data-[collapsible=icon]:hidden">Navigation</p>
          </div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.path)}
                  isActive={item.active}
                  className="theme-menu-button"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <div className="px-2 py-1 mt-4">
            <p className="text-xs font-medium theme-text-secondary group-data-[collapsible=icon]:hidden">Quick Actions</p>
          </div>
          <SidebarMenu>
            {quickActions.map((action, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  onClick={action.action}
                  className="theme-menu-button"
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <div className="px-2 py-1 mt-4">
            <p className="text-xs font-medium theme-text-secondary group-data-[collapsible=icon]:hidden">Settings</p>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={toggleDarkMode}
                className="theme-menu-button"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <div className="flex items-center justify-between w-full px-2 py-1.5">
                <div className="flex items-center gap-2 flex-1">
                  <Settings className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <SettingsPanel />
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const VerticalNavigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full theme-responsive-bg">
        <NavigationContent />
        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="theme-button-primary hover:theme-button-primary-hover transition-all duration-300 animate-pulse-glow" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

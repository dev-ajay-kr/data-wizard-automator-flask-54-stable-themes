
import React, { useEffect } from 'react';
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
  Settings
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsPanel } from '@/components/SettingsPanel';

const NavigationContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();
  const { open, setOpen } = useSidebar();

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
      label: 'Upload CSV',
      path: '/chat?tab=csv-upload',
      active: currentTab === 'csv-upload'
    },
    {
      icon: Database,
      label: 'Datasource',
      path: '/chat?tab=datasource-utilities',
      active: currentTab === 'datasource-utilities'
    },
    {
      icon: Zap,
      label: 'Functions',
      path: '/chat?tab=functions',
      active: currentTab === 'functions'
    }
  ];

  // Handle navigation and close sidebar on mobile
  const handleNavigation = (path: string) => {
    navigate(path);
    // On mobile devices, close the sidebar after navigation
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Sidebar className={`theme-sidebar theme-${currentTheme}`}>
      <SidebarHeader className="p-4 border-b theme-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold theme-text-primary">ETLHub</h1>
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
                  onClick={() => handleNavigation(item.path)}
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
            {quickActions.map((action) => (
              <SidebarMenuItem key={action.path}>
                <SidebarMenuButton 
                  onClick={() => handleNavigation(action.path)}
                  isActive={action.active}
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
  const { currentTheme } = useTheme();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full theme-responsive-bg theme-${currentTheme}`}>
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

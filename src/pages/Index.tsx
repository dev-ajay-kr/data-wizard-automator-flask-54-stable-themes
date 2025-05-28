
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabNavigation } from '@/components/TabNavigation';
import { ChatInterface } from '@/components/ChatInterface';
import { CSVUpload } from '@/components/CSVUpload';
import { DatasourceUtilities } from '@/components/DatasourceUtilities';
import { Functions } from '@/components/Functions';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('chat');
  const { darkMode } = useTheme();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'csv-upload':
        return <CSVUpload />;
      case 'datasource-utilities':
        return <DatasourceUtilities />;
      case 'functions':
        return <Functions />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">ETL Warehousing Automation</h1>
          </div>
        </header>
        
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="py-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import { CSVUpload } from '@/components/CSVUpload';
import { DatasourceUtilities } from '@/components/DatasourceUtilities';
import { Functions } from '@/components/Functions';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('gemini');
  const { currentTheme } = useTheme();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    } else {
      // Default to gemini if no tab specified
      setActiveTab('gemini');
    }
  }, [searchParams]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'gemini':
        return (
          <div className="animate-fade-in">
            <ChatInterface />
          </div>
        );
      case 'csv-upload':
        return (
          <div className="animate-slide-in-right">
            <CSVUpload />
          </div>
        );
      case 'datasource-utilities':
        return (
          <div className="animate-slide-in-right">
            <DatasourceUtilities />
          </div>
        );
      case 'functions':
        return (
          <div className="animate-slide-in-right">
            <Functions />
          </div>
        );
      default:
        return (
          <div className="animate-fade-in">
            <ChatInterface />
          </div>
        );
    }
  };

  return (
    <div className="min-h-full w-full">        
      <main className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Index;

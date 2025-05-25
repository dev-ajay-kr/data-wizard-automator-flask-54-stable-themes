
import React, { useState } from 'react';
import { TabNavigation } from '@/components/TabNavigation';
import { ChatInterface } from '@/components/ChatInterface';
import { CSVUpload } from '@/components/CSVUpload';
import { DatasourceUtilities } from '@/components/DatasourceUtilities';
import { Functions } from '@/components/Functions';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-blue-600">ETL Warehousing Automation</h1>
        </div>
      </header>
      
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Index;

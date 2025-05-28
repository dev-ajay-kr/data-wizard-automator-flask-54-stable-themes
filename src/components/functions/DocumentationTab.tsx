
import React from 'react';
import { Card } from '@/components/ui/card';

export const DocumentationTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Function Documentation</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">ETL Functions</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Data Cleansing</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Purpose:</strong> Removes inconsistencies and errors from datasets using AI analysis
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Input:</strong> Your uploaded CSV files
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Output:</strong> Detailed quality report with specific recommendations
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Functions</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Statistical Analysis</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Purpose:</strong> AI-powered statistical analysis of your actual data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Input:</strong> Numeric datasets from uploaded files
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Output:</strong> Comprehensive statistical insights and interpretations
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Automation Functions</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Schedule ETL Jobs</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Purpose:</strong> AI suggests optimal ETL workflows based on your data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Input:</strong> Data characteristics from uploaded files
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Output:</strong> Customized ETL job recommendations with schedules
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};


import React from 'react';
import { Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by</span>
            <a 
              href="https://github.com/dev-ajay-kr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Github className="w-4 h-4" />
              dev-ajay-kr
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ETL Warehousing Automation Platform © 2024
          </div>
        </div>
      </div>
    </footer>
  );
};

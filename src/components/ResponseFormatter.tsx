
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Database, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToWord, exportToPNG, exportToCSV, exportToText, detectTableData } from '@/utils/advancedExportUtils';

interface ResponseFormatterProps {
  content: string;
  enableExports?: boolean;
  title?: string;
  chartId?: string;
}

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ 
  content, 
  enableExports = false, 
  title = "Analysis",
  chartId 
}) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  // Copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "📋 Copied to Clipboard",
        description: "Content has been copied successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Export handlers
  const handleWordExport = () => {
    exportToWord(content, title);
  };

  const handlePNGExport = () => {
    if (chartId) {
      exportToPNG(chartId, title);
    } else if (contentRef.current) {
      // Generate a unique ID for the content
      const tempId = `export-content-${Date.now()}`;
      contentRef.current.id = tempId;
      exportToPNG(tempId, title);
    }
  };

  const handleCSVExport = () => {
    exportToCSV(content, title);
  };

  const handleTextExport = () => {
    exportToText(content, title);
  };

  const hasTableData = detectTableData(content);

  // Custom components for markdown rendering
  const components = {
    // Handle bold text properly
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
    ),
    
    // Handle italic text properly
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
    ),
    
    // Handle headings with consistent styling
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-6 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3 mt-5 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-4 first:mt-0">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 mt-3 first:mt-0">{children}</h4>
    ),
    
    // Handle code blocks with syntax highlighting
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (inline) {
        return (
          <code 
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            {...props}
          >
            {children}
          </code>
        );
      }
      
      return (
        <div className="my-4">
          {language && (
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-t border-b">
              {language}
            </div>
          )}
          <pre className={`bg-gray-50 dark:bg-gray-900 p-4 rounded${language ? '-b' : ''} overflow-x-auto border`}>
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    
    // Handle lists with proper styling
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside my-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside my-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="text-gray-700 dark:text-gray-300">{children}</li>
    ),
    
    // Handle paragraphs
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="my-2 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
    ),
    
    // Handle blockquotes
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 my-4 bg-blue-50 dark:bg-blue-900/20 py-2 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    
    // Handle tables
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">
        {children}
      </th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),
    
    // Handle links
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a 
        href={href} 
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    
    // Handle horizontal rules
    hr: () => (
      <hr className="my-6 border-gray-300 dark:border-gray-600" />
    )
  };

  return (
    <div className="space-y-4">
      {/* Export Controls */}
      {enableExports && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-2 mr-4">
            <Badge variant="outline" className="text-xs">Export Options</Badge>
          </div>
          
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </Button>
          
          <Button
            onClick={handleWordExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            Word
          </Button>
          
          <Button
            onClick={handlePNGExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Image className="w-3 h-3" />
            PNG
          </Button>
          
          {hasTableData && (
            <Button
              onClick={handleCSVExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Database className="w-3 h-3" />
              CSV
            </Button>
          )}
          
          <Button
            onClick={handleTextExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Text
          </Button>
        </div>
      )}

      {/* Content Display */}
      <div 
        ref={contentRef}
        className="prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-gray-900 p-4 rounded-lg border shadow-sm"
        style={{ 
          minHeight: '200px',
          width: '100%',
          padding: '24px'
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
          className="markdown-content"
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

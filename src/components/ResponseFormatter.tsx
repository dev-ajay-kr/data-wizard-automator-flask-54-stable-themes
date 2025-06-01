
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, BarChart3 } from 'lucide-react';
import { exportToWord, exportToPNG, exportToCSV, exportToText, detectTableData, safeFallback } from '@/utils/advancedExportUtils';

interface ResponseFormatterProps {
  content: string;
  className?: string;
  enableExports?: boolean;
  title?: string;
}

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ 
  content, 
  className = '',
  enableExports = false,
  title = 'Response'
}) => {
  const hasTableData = detectTableData(content);
  const chartId = `chart-${Date.now()}`;

  const handleExport = (type: 'word' | 'png' | 'csv' | 'text') => {
    const filename = title.replace(/[^a-z0-9]/gi, '_') || 'export';
    
    switch (type) {
      case 'word':
        exportToWord(content, filename);
        break;
      case 'png':
        exportToPNG(chartId, filename);
        break;
      case 'csv':
        exportToCSV(content, filename);
        break;
      case 'text':
        exportToText(content, filename);
        break;
    }
  };

  const formatContent = (text: string) => {
    // Split content into sections by double newlines
    const sections = text.split(/\n\s*\n/);
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;

      // Headers - Handle multiple levels with ** bold support
      if (trimmedSection.match(/^#{1,6}\s/)) {
        const headerMatch = trimmedSection.match(/^(#{1,6})\s+(.*)/);
        if (headerMatch) {
          const [, hashes, headerText] = headerMatch;
          const level = hashes.length;
          const cleanText = headerText.replace(/\*\*/g, '');
          
          if (level === 1) {
            return (
              <h1 key={index} className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-8 mb-6 border-b-2 border-blue-200 dark:border-blue-700 pb-3">
                {cleanText}
              </h1>
            );
          } else if (level === 2) {
            return (
              <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-7 mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">
                {cleanText}
              </h2>
            );
          } else if (level === 3) {
            return (
              <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4">
                {cleanText}
              </h3>
            );
          } else if (level === 4) {
            return (
              <h4 key={index} className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-5 mb-3">
                {cleanText}
              </h4>
            );
          } else if (level === 5) {
            return (
              <h5 key={index} className="text-base font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">
                {cleanText}
              </h5>
            );
          } else {
            return (
              <h6 key={index} className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-3 mb-2">
                {cleanText}
              </h6>
            );
          }
        }
      }
      
      // Code blocks with language detection and enhanced styling
      const codeBlockMatch = trimmedSection.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const [, language, code] = codeBlockMatch;
        return (
          <Card key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 my-6 overflow-hidden">
            {language && (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <Badge variant="outline" className="text-xs font-mono">
                  {language}
                </Badge>
              </div>
            )}
            <div className="overflow-x-auto">
              <pre className="p-6 text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                <code>{code.trim()}</code>
              </pre>
            </div>
          </Card>
        );
      }
      
      // Tables - Enhanced detection and styling
      if (trimmedSection.includes('|') && trimmedSection.match(/\|.*\|.*\n.*\|.*[-:]+.*\|/)) {
        const lines = trimmedSection.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
          const separatorLine = lines[1];
          
          // Validate separator line
          if (separatorLine.includes('---') || separatorLine.includes('-')) {
            const rows = lines.slice(2).map(line => 
              line.split('|').map(cell => cell.trim()).filter(cell => cell)
            );
            
            return (
              <Card key={index} className="my-6 overflow-hidden" id={hasTableData ? chartId : undefined}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      {headers.map((header, i) => (
                        <TableHead key={i} className="font-semibold text-gray-900 dark:text-gray-100 px-6 py-4">
                          {formatInlineText(header)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-gray-700 dark:text-gray-300 px-6 py-4">
                            {formatInlineText(safeFallback(cell))}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            );
          }
        }
      }
      
      // Task Lists (Checkboxes)
      if (trimmedSection.match(/^[\s]*-\s+\[[x ]\]/m)) {
        const taskItems = trimmedSection.split('\n').filter(line => line.trim().match(/^-\s+\[[x ]\]/));
        
        return (
          <div key={index} className="my-4 space-y-2">
            {taskItems.map((item, i) => {
              const isChecked = item.includes('[x]');
              const taskText = item.replace(/^-\s+\[[x ]\]\s*/, '');
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    readOnly
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                  />
                  <span className={`text-gray-700 dark:text-gray-300 ${isChecked ? 'line-through text-gray-500' : ''}`}>
                    {formatInlineText(taskText)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
      
      // Regular lists (unordered and ordered)
      const listItems = trimmedSection.split('\n').filter(line => 
        line.trim().match(/^[•\-\*]\s+/) || line.trim().match(/^\d+\.\s+/)
      );
      
      if (listItems.length > 0 && listItems.length === trimmedSection.split('\n').filter(line => line.trim()).length) {
        const isOrdered = listItems[0].trim().match(/^\d+\./);
        
        return (
          <div key={index} className="my-5">
            {isOrdered ? (
              <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 pl-2">
                {listItems.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {formatInlineText(item.replace(/^\d+\.\s*/, ''))}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 pl-2">
                {listItems.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {formatInlineText(item.replace(/^[•\-\*]\s*/, ''))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      
      // Blockquotes
      if (trimmedSection.startsWith('>')) {
        const quoteText = trimmedSection.replace(/^>\s*/, '').replace(/\n>\s*/g, '\n');
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-4 my-6 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
            {formatInlineText(quoteText)}
          </blockquote>
        );
      }
      
      // Horizontal rules
      if (trimmedSection.match(/^-{3,}$|^\*{3,}$|^_{3,}$/)) {
        return <Separator key={index} className="my-8" />;
      }
      
      // Regular paragraphs with enhanced spacing
      return (
        <div key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">
          {trimmedSection.split('\n').map((line, lineIndex) => (
            <p key={lineIndex} className="mb-3 last:mb-0">
              {formatInlineText(line)}
            </p>
          ))}
        </div>
      );
    }).filter(Boolean);
  };
  
  const formatInlineText = (text: string) => {
    if (!text) return '';
    
    let processedText = text;
    
    // Bold text - **text** or __text__ (enhanced pattern)
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
    processedText = processedText.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
    
    // Bold + Italic - ***text***
    processedText = processedText.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold italic text-gray-900 dark:text-gray-100">$1</strong>');
    
    // Italic text - *text* or _text_
    processedText = processedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    processedText = processedText.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    
    // Strikethrough - ~~text~~
    processedText = processedText.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500 dark:text-gray-400">$1</del>');
    
    // Inline code - `code`
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400 border">$1</code>');
    
    // Links - [text](url) with enhanced styling
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };
  
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      {enableExports && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <Button
            onClick={() => handleExport('text')}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export Text
          </Button>
          <Button
            onClick={() => handleExport('word')}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Word
          </Button>
          {hasTableData && (
            <>
              <Button
                onClick={() => handleExport('csv')}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport('png')}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Export PNG
              </Button>
            </>
          )}
        </div>
      )}
      <div id={chartId}>
        {formatContent(content)}
      </div>
    </div>
  );
};

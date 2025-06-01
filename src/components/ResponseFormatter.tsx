
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface ResponseFormatterProps {
  content: string;
  className?: string;
}

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ content, className = '' }) => {
  const formatContent = (text: string) => {
    // Split content into sections by double newlines
    const sections = text.split(/\n\s*\n/);
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;

      // Headers - Handle multiple levels
      if (trimmedSection.match(/^#{1,6}\s/)) {
        const headerMatch = trimmedSection.match(/^(#{1,6})\s+(.*)/);
        if (headerMatch) {
          const [, hashes, headerText] = headerMatch;
          const level = hashes.length;
          const cleanText = headerText.replace(/\*\*/g, '');
          
          if (level === 1) {
            return (
              <h1 key={index} className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-8 mb-6 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                {cleanText}
              </h1>
            );
          } else if (level === 2) {
            return (
              <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                {cleanText}
              </h2>
            );
          } else if (level === 3) {
            return (
              <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-3">
                {cleanText}
              </h3>
            );
          } else {
            return (
              <h4 key={index} className="text-base font-medium text-gray-900 dark:text-gray-100 mt-3 mb-2">
                {cleanText}
              </h4>
            );
          }
        }
      }
      
      // Code blocks with language detection
      const codeBlockMatch = trimmedSection.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const [, language, code] = codeBlockMatch;
        return (
          <Card key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 my-4 overflow-hidden">
            {language && (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <Badge variant="outline" className="text-xs font-mono">
                  {language}
                </Badge>
              </div>
            )}
            <div className="overflow-x-auto">
              <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                <code>{code.trim()}</code>
              </pre>
            </div>
          </Card>
        );
      }
      
      // Tables - Enhanced detection
      if (trimmedSection.includes('|') && trimmedSection.match(/\|.*\|.*\n.*\|.*-.*\|/)) {
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
              <Card key={index} className="my-4 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      {headers.map((header, i) => (
                        <TableHead key={i} className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatInlineText(header)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-gray-700 dark:text-gray-300">
                            {formatInlineText(cell)}
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
      
      // Unordered lists
      const listItems = trimmedSection.split('\n').filter(line => 
        line.trim().match(/^[•\-\*]\s+/) || line.trim().match(/^\d+\.\s+/)
      );
      
      if (listItems.length > 0 && listItems.length === trimmedSection.split('\n').filter(line => line.trim()).length) {
        const isOrdered = listItems[0].trim().match(/^\d+\./);
        
        return (
          <div key={index} className="my-4">
            {isOrdered ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {listItems.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {formatInlineText(item.replace(/^\d+\.\s*/, ''))}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
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
          <blockquote key={index} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300">
            {formatInlineText(quoteText)}
          </blockquote>
        );
      }
      
      // Horizontal rules
      if (trimmedSection.match(/^-{3,}$|^\*{3,}$|^_{3,}$/)) {
        return <Separator key={index} className="my-6" />;
      }
      
      // Regular paragraphs
      return (
        <div key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed my-3">
          {trimmedSection.split('\n').map((line, lineIndex) => (
            <p key={lineIndex} className="mb-2 last:mb-0">
              {formatInlineText(line)}
            </p>
          ))}
        </div>
      );
    }).filter(Boolean);
  };
  
  const formatInlineText = (text: string) => {
    if (!text) return '';
    
    // Process text to handle inline formatting
    let processedText = text;
    
    // Bold text - **text** or __text__
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
    processedText = processedText.replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
    
    // Italic text - *text* or _text_
    processedText = processedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    processedText = processedText.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    
    // Inline code - `code`
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400 border">$1</code>');
    
    // Links - [text](url)
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Strikethrough - ~~text~~
    processedText = processedText.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500 dark:text-gray-400">$1</del>');
    
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };
  
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {formatContent(content)}
    </div>
  );
};

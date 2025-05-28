
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ResponseFormatterProps {
  content: string;
  className?: string;
}

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ content, className = '' }) => {
  const formatContent = (text: string) => {
    // Split content into sections
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // Headers
      if (section.startsWith('###')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
            {section.replace('###', '').trim()}
          </h3>
        );
      }
      
      if (section.startsWith('##')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
            {section.replace('##', '').trim()}
          </h2>
        );
      }
      
      if (section.startsWith('#')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-8 mb-6">
            {section.replace('#', '').trim()}
          </h1>
        );
      }
      
      // Code blocks
      if (section.includes('```')) {
        const codeMatch = section.match(/```(\w+)?\n([\s\S]*?)```/);
        if (codeMatch) {
          const [, language, code] = codeMatch;
          return (
            <Card key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 my-4">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
                {language && (
                  <Badge variant="outline" className="text-xs">
                    {language}
                  </Badge>
                )}
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                <code>{code.trim()}</code>
              </pre>
            </Card>
          );
        }
      }
      
      // Tables
      if (section.includes('|') && section.includes('---')) {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
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
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-gray-700 dark:text-gray-300">
                          {formatInlineContent(cell)}
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
      
      // Lists
      if (section.includes('\n- ') || section.includes('\n• ')) {
        const items = section.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('• '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {formatInlineContent(item.replace(/^[\s]*[-•]\s*/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Numbered lists
      if (/^\d+\./.test(section.trim())) {
        const items = section.split('\n').filter(line => /^\d+\./.test(line.trim()));
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {formatInlineContent(item.replace(/^\d+\.\s*/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraphs
      if (section.trim()) {
        return (
          <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed my-3">
            {formatInlineContent(section)}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };
  
  const formatInlineContent = (text: string) => {
    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
    
    // Italic text
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    
    // Inline code
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };
  
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {formatContent(content)}
    </div>
  );
};

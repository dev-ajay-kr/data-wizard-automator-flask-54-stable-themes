
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Copy, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { toast } = useToast();
  const isUser = message.role === 'user';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 mt-1 hover-scale">
          <AvatarFallback className="bg-gray-500 text-white dark:bg-gray-600">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
        <div className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-md ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md dark:bg-gray-700 dark:text-gray-100'
        }`}>
          {isUser ? (
            <p className="text-white">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {children}
                    </td>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto my-3">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-800 dark:text-gray-200">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="mt-2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 mt-1 order-2 hover-scale">
          <AvatarFallback className="bg-blue-500 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

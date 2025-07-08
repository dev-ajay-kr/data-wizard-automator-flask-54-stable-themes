
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Mic, Home, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { FileUpload } from './FileUpload';
import { ResponseFormatter } from './ResponseFormatter';
import { LoadingState } from './ui/loading';
import { useNavigate } from 'react-router-dom';
import { safeFallback } from '@/utils/advancedExportUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { apiService } from '@/services/apiService';
import { ErrorHandler, logError } from '@/utils/errorHandling';
import { performanceMonitor } from '@/utils/performance';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
  error?: boolean;
}

export const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { files } = useFiles();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent, retryMessage?: string) => {
    e.preventDefault();
    const currentPrompt = retryMessage || prompt;
    if (!currentPrompt.trim()) return;

    performanceMonitor.startMeasure('chat-request');

    // Include file context if files are uploaded
    let contextualPrompt = currentPrompt;
    if (files.length > 0) {
      const fileContext = files.map(f => `File: ${f.name} (${f.type})`).join(', ');
      contextualPrompt = `Context: I have uploaded files: ${fileContext}\n\nUser question: ${currentPrompt}`;
    }

    const userMessage: Message = {
      role: 'user',
      content: currentPrompt,
      timestamp: new Date(),
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    if (!retryMessage) {
      setPrompt('');
      setRetryCount(0);
    }

    try {
      console.log('🚀 Sending chat request:', {
        promptLength: contextualPrompt.length,
        hasFiles: files.length > 0,
        retryAttempt: retryCount + 1
      });

      const result = await apiService.retryRequest(
        () => apiService.callGemini({
          prompt: contextualPrompt,
          model: 'gemini-1.5-flash',
          temperature: 0.7,
          maxTokens: 2048
        }),
        3,
        1000
      );

      if (result.success && result.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.data,
          timestamp: new Date(),
          id: (Date.now() + 1).toString()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "✅ **Response Generated**",
          description: "AI response received successfully.",
        });
        
        setRetryCount(0);
      } else {
        throw new Error(result.error || 'Failed to get response');
      }
    } catch (error: any) {
      const appError = ErrorHandler.handleApiError(error);
      logError(appError, 'ChatInterface');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: appError.message,
        timestamp: new Date(),
        id: (Date.now() + 2).toString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "❌ **Error**",
        description: appError.message,
        variant: "destructive"
      });
      
      if (appError.retryable) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
      performanceMonitor.endMeasure('chat-request');
    }
  };

  const handleRetry = (messageContent: string) => {
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent, messageContent);
  };

  const quickPrompts = [
    {
      text: "Analyze the uploaded CSV data and provide insights",
      category: "analysis",
      color: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
    },
    {
      text: "Create a dashboard with visualizations for my data",
      category: "visualization", 
      color: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
    },
    {
      text: "What ETL best practices should I follow for data processing?",
      category: "best-practices",
      color: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
    },
    {
      text: "Help me clean and validate this dataset",
      category: "data-cleaning",
      color: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30"
    }
  ];

  return (
    <div className={`min-h-screen theme-responsive-bg theme-${currentTheme}`}>
      <header className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b dark:border-gray-700 theme-${currentTheme}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover-scale theme-button-nav"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent theme-text-primary">
                Chat with Gemini AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className={`max-w-6xl mx-auto p-6 theme-${currentTheme}`}>
        {/* File Upload */}
        <Card className={`p-6 mb-6 theme-card theme-${currentTheme}`}>
          <h3 className={`font-semibold theme-text-primary mb-3 flex items-center gap-2`}>
            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Upload Files for Analysis
          </h3>
          <FileUpload />
        </Card>

        {/* Chat Messages */}
        <Card className={`mb-6 h-[500px] theme-card theme-${currentTheme}`}>
          <ScrollArea ref={scrollAreaRef} className="h-full p-6">
            {messages.length === 0 ? (
              <div className={`flex items-center justify-center h-full theme-text-secondary`}>
                <div className="text-center max-w-2xl">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg mb-6">Start a conversation with Gemini AI</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickPrompts.map((promptItem, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className={`cursor-pointer hover-scale transition-all p-3 text-left justify-start h-auto ${promptItem.color}`}
                        onClick={() => setPrompt(promptItem.text)}
                      >
                        <div className="text-sm font-medium">{promptItem.text}</div>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-4 mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                          : message.error
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-bl-md'
                          : 'theme-card rounded-bl-md'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div>
                            {message.error && (
                              <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Error occurred</span>
                              </div>
                            )}
                            <ResponseFormatter 
                              content={message.content} 
                              enableExports={!message.error}
                              title={`Gemini_Response_${message.id}`}
                            />
                            {message.error && retryCount < 3 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRetry(messages.find(m => m.role === 'user' && m.timestamp < message.timestamp)?.content || '')}
                                className="mt-3 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Retry
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        )}
                      </div>
                      <div className={`text-xs theme-text-muted mt-2 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {safeFallback(message.timestamp, 'date')}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 mb-6 justify-start">
                    <div className={`theme-card rounded-2xl rounded-bl-md px-6 py-4 shadow-lg`}>
                      <LoadingState 
                        type="api" 
                        message="Gemini is thinking..." 
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Input Form */}
        <Card className={`p-6 theme-card theme-${currentTheme}`}>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Gemini anything about your data..."
                className={`min-h-[80px] resize-none theme-input`}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim()} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-full px-8 hover-scale theme-button-primary"
              >
                <Send className="w-5 h-5" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 hover-scale theme-button-secondary"
                title="Voice input (coming soon)"
                disabled
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

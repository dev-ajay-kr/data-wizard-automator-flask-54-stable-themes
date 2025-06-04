
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Mic, Home, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { FileUpload } from './FileUpload';
import { ResponseFormatter } from './ResponseFormatter';
import { useNavigate } from 'react-router-dom';
import { safeFallback } from '@/utils/advancedExportUtils';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

export const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey?.trim()) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please configure your Gemini API key in the settings panel from the Home page first.',
        timestamp: new Date(),
        id: Date.now().toString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    console.log('Sending prompt:', prompt);

    // Include file context if files are uploaded
    let contextualPrompt = prompt;
    if (files.length > 0) {
      const fileContext = files.map(f => `File: ${f.name} (${f.type})`).join(', ');
      contextualPrompt = `Context: I have uploaded files: ${fileContext}\n\nUser question: ${prompt}`;
    }

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextualPrompt
            }]
          }]
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Details:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
        id: (Date.now() + 1).toString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error connecting to the Gemini API. Please check your API key in the Home settings and try again.',
        timestamp: new Date(),
        id: (Date.now() + 2).toString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg mb-6">Start a conversation with Gemini AI</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover-scale transition-all theme-badge" 
                      onClick={() => setPrompt("Analyze the uploaded CSV data and provide insights")}
                    >
                      Analyze CSV data
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 hover-scale transition-all theme-badge"
                      onClick={() => setPrompt("Create a dashboard with visualizations for my data")}
                    >
                      Create dashboard
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 hover-scale transition-all theme-badge"
                      onClick={() => setPrompt("What ETL best practices should I follow for data processing?")}
                    >
                      ETL best practices
                    </Badge>
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
                          : 'theme-card rounded-bl-md'
                      }`}>
                        {message.role === 'assistant' ? (
                          <ResponseFormatter 
                            content={message.content} 
                            enableExports={true}
                            title={`Gemini_Response_${message.id}`}
                          />
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
                      <div className={`flex items-center gap-3 theme-text-secondary`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">Gemini is thinking...</span>
                      </div>
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

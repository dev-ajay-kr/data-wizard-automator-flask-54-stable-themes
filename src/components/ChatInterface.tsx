
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Mic, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFiles } from '@/contexts/FileContext';
import { FileUpload } from './FileUpload';
import { ResponseFormatter } from './ResponseFormatter';
import { useNavigate } from 'react-router-dom';
import { ApiKeyManager } from './ApiKeyManager';
import { safeFallback } from '@/utils/advancedExportUtils';

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
        content: 'Please configure your Gemini API key in the settings panel first.',
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
        content: 'Sorry, there was an error connecting to the Gemini API. Please check your API key and try again.',
        timestamp: new Date(),
        id: (Date.now() + 2).toString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Chat with Gemini</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* API Key Management */}
        <div className="mb-6">
          <ApiKeyManager />
        </div>

        {/* File Upload */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Upload Files</h3>
          <FileUpload />
        </Card>

        {/* Chat Messages */}
        <Card className="mb-6 h-96 dark:bg-gray-800">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>Start a conversation with Gemini</p>
                  <div className="mt-4 space-y-2">
                    <Badge variant="outline" className="mr-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" 
                          onClick={() => setPrompt("Analyze the uploaded CSV data")}>
                      Analyze CSV data
                    </Badge>
                    <Badge variant="outline" className="mr-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => setPrompt("Suggest dashboard visualizations")}>
                      Suggest dashboards
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => setPrompt("What ETL best practices should I follow?")}>
                      ETL best practices
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white rounded-br-md' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}>
                        {message.role === 'assistant' ? (
                          <ResponseFormatter 
                            content={message.content} 
                            enableExports={true}
                            title={`Chat_Response_${message.id}`}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {safeFallback(message.timestamp, 'date')}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 mb-4 justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Input Form */}
        <Card className="p-4 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading || !prompt.trim()} className="bg-blue-600 hover:bg-blue-700 h-full">
                <Send className="w-4 h-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

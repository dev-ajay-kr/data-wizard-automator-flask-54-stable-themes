
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Key, Copy, User, Bot, Moon, Sun, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

export const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      console.log('API key loaded from localStorage:', savedApiKey.substring(0, 10) + '...');
    } else {
      localStorage.setItem('gemini_api_key', 'AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A');
      console.log('API key set and saved to localStorage');
    }
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('gemini_api_key', newApiKey);
    console.log('API key updated and saved to localStorage');
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    if (!apiKey.trim()) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please enter your Gemini API key first to use the chat functionality.',
        timestamp: new Date(),
        id: Date.now().toString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    console.log('Sending prompt:', prompt);

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
              text: prompt
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

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    return (
      <div key={message.id} className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <Avatar className="w-8 h-8 mt-1">
            <AvatarFallback className="bg-gray-500 text-white">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}>
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={i} className={`font-bold mb-2 ${isUser ? 'text-blue-100' : 'text-gray-800'}`}>{line.slice(2, -2)}</h4>;
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className={`ml-4 ${isUser ? 'text-blue-100' : 'text-gray-700'}`}>{line.slice(2)}</li>;
                }
                return line ? <p key={i} className={`mb-2 ${isUser ? 'text-white' : 'text-gray-700'}`}>{line}</p> : <br key={i} />;
              })}
            </div>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="mt-2 h-6 w-6 p-0 hover:bg-gray-200"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>

        {isUser && (
          <Avatar className="w-8 h-8 mt-1 order-2">
            <AvatarFallback className="bg-blue-500 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'dark' : ''}`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Chat with Gemini
          </h2>
          <p className="text-gray-600">Get AI-powered insights about your data and ETL processes</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light' : 'Dark'}
        </Button>
      </div>

      {/* API Key Input */}
      <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-amber-600" />
          <h3 className="font-semibold text-amber-800">Gemini API Key</h3>
        </div>
        <Input
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your Gemini API key..."
          className="bg-white"
        />
        <p className="text-xs text-amber-700 mt-2">
          Your API key is stored locally in your browser. For production use, consider using Supabase for secure storage.
        </p>
        <p className="text-xs text-green-700 mt-1">
          Status: {apiKey ? `API key loaded (${apiKey.substring(0, 10)}...)` : 'No API key set'}
        </p>
      </Card>

      {/* Chat Messages */}
      <Card className="mb-6 h-96">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start a conversation with Gemini</p>
                <div className="mt-4 space-y-2">
                  <Badge variant="outline" className="mr-2 cursor-pointer hover:bg-gray-50" 
                        onClick={() => setPrompt("Analyze the uploaded CSV data")}>
                    Analyze CSV data
                  </Badge>
                  <Badge variant="outline" className="mr-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => setPrompt("Suggest dashboard visualizations")}>
                    Suggest dashboards
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setPrompt("What ETL best practices should I follow?")}>
                    ETL best practices
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex gap-3 mb-4 justify-start">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gray-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
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
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none border-gray-200 focus:border-blue-500"
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
      </div>
    </div>
  );
};

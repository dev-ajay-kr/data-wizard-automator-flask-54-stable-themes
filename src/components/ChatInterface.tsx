
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, Key } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      console.log('API key loaded from localStorage:', savedApiKey.substring(0, 10) + '...');
    } else {
      // Set the provided API key and save it to localStorage
      localStorage.setItem('gemini_api_key', 'AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A');
      console.log('API key set and saved to localStorage');
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('gemini_api_key', newApiKey);
    console.log('API key updated and saved to localStorage');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    if (!apiKey.trim()) {
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Please enter your Gemini API key first to use the chat functionality.'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    console.log('Sending prompt:', prompt);

    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    try {
      // Use the correct Gemini API endpoint with the updated model name
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
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, there was an error connecting to the Gemini API. Please check your API key and try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Chat with Gemini
        </h2>
        <p className="text-gray-600">Get AI-powered insights about your data and ETL processes</p>
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

      <div className="space-y-4 mb-6">
        {messages.map((message, index) => (
          <Card key={index} className={`p-4 ${message.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {message.role === 'user' ? 'U' : 'AI'}
              </div>
              <div className="flex-1">
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h4 key={i} className="font-bold text-gray-800 mb-2">{line.slice(2, -2)}</h4>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
                    }
                    return line ? <p key={i} className="text-gray-700 mb-2">{line}</p> : <br key={i} />;
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {isLoading && (
          <Card className="p-4 bg-gray-50 mr-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for Gemini..."
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

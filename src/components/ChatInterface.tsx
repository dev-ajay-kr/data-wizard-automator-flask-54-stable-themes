
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: `I understand you want to analyze data. Here's what I can help you with:

**Data Analysis Capabilities:**
- CSV file structure analysis
- Data quality assessment
- Column profiling and statistics
- Dashboard recommendations
- ETL pipeline suggestions

Please upload your CSV files using the "CSV Upload" tab, and I'll provide detailed insights about your data structure and recommend the best visualization approaches.`
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
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

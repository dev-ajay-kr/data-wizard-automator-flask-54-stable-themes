import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Upload, FileText, CheckCircle, AlertCircle, MessageCircle, Send, Bot, User, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/hooks/useGemini';
import { useFiles } from '@/contexts/FileContext';

interface UploadedFile {
  name: string;
  size: number;
  preview: string[][];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

export const CSVUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('gemini_api_key'));
  const { toast } = useToast();
  const { callGemini, isLoading: isChatLoading } = useGemini();
  const { addFile, getFileData } = useFiles();

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "🔑 **API Key Saved**",
        description: "Gemini API key has been saved successfully.",
      });
    }
  };

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n').slice(0, 6);
          const preview = lines.map(line => line.split(',').slice(0, 5));
          
          const newFile = {
            name: file.name,
            size: file.size,
            preview
          };
          
          setUploadedFiles(prev => [...prev, newFile]);
          
          // Add to global file context
          addFile({
            id: `csv-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            content: text,
            preview,
            uploadedAt: new Date()
          });
          
          toast({
            title: "📊 **File Uploaded Successfully**",
            description: `**${file.name}** has been processed and analyzed.`,
          });

          // Add initial chat message about the uploaded file
          const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: `## 🎉 **File Upload Complete!**

**"${file.name}"** has been uploaded successfully! 

### 📋 **What I can help you with:**

• **📊 Data Analysis** - "What are the main columns in this dataset?"
• **📈 Summary Statistics** - "Show me summary statistics"  
• **🔍 Pattern Detection** - "What patterns do you see in the data?"
• **📉 Visualization Ideas** - "Suggest visualizations for this data"
• **🧹 Data Quality** - "Check for missing values or inconsistencies"
• **🔗 Relationships** - "Find correlations between columns"

### 💡 **Quick Start Questions:**
> *Try asking: "Analyze the structure of my data" or "What insights can you provide?"*`,
            timestamp: new Date(),
            id: `welcome-${Date.now()}`
          };
          setChatMessages(prev => [...prev, welcomeMessage]);
          setShowChat(true);
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "⚠️ **Invalid File Type**",
          description: "Please upload a **CSV file** only.",
          variant: "destructive",
        });
      }
    });
  }, [toast, addFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "🔑 **API Key Required**",
        description: "Please enter your Gemini API key to chat with your data.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    try {
      // Get file context for Gemini
      const fileContext = getFileData();
      const response = await callGemini(currentInput, fileContext);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
        timestamp: new Date(),
        id: `assistant-${Date.now()}`
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `## ⚠️ **Error**\n\nI encountered an issue: **${error.message}**\n\nPlease check your API key and try again.`,
        timestamp: new Date(),
        id: `error-${Date.now()}`
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFormattedMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Handle headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-3">{line.replace('## ', '')}</h2>;
      }
      
      // Handle bullet points
      if (line.startsWith('• ')) {
        return <li key={i} className="ml-4 mb-1 text-gray-700 dark:text-gray-300">{line.replace('• ', '')}</li>;
      }
      
      // Handle quotes
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-2">{line.replace('> ', '')}</blockquote>;
      }
      
      // Handle bold text
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return line ? (
        <p key={i} className="mb-1 text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: boldFormatted }} />
      ) : (
        <br key={i} />
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          **CSV Upload**
        </h2>
        <p className="text-gray-600">Upload your CSV files for analysis and processing</p>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <Card className="p-4 mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">**Gemini API Key Required**</h3>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit}>Save</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card 
            className={`p-8 border-2 border-dashed transition-colors duration-200 ${
              isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">**Upload CSV Files**</h3>
              <p className="text-gray-600 mb-4">Drag and drop your CSV files here, or click to select</p>
              <input
                type="file"
                multiple
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                **Uploaded Files** ({uploadedFiles.length})
              </h3>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">**{file.name}**</h4>
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">**Processed**</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium text-gray-900 mb-2">**Data Preview**</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm">
                          <tbody>
                            {file.preview.slice(0, 4).map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-medium' : 'bg-white'}>
                                {row.slice(0, 4).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-2 py-1 border-r border-gray-200 text-xs">
                                    {cell.trim() || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              **Chat with your data**
            </h3>
            {uploadedFiles.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </Button>
            )}
          </div>

          {uploadedFiles.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Upload a CSV file to start chatting about your data</p>
              </div>
            </Card>
          ) : showChat ? (
            <Card className="h-96 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="w-6 h-6 mt-1">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none">
                            {renderFormattedMessage(message.content)}
                          </div>
                        ) : (
                          message.content.split('\n').map((line, i) => (
                            line ? <p key={i} className="mb-1 last:mb-0">{line}</p> : <br key={i} />
                          ))
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="w-6 h-6 mt-1 order-2">
                        <AvatarFallback className="bg-gray-500 text-white">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex gap-3 mb-4 justify-start">
                    <Avatar className="w-6 h-6 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-600">**Analyzing...**</span>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your data..."
                    className="flex-1"
                    disabled={isChatLoading}
                  />
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <Button
                onClick={() => setShowChat(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                **Start chatting with your data**
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

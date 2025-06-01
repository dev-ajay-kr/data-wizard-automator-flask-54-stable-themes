
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Edit, Check, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyManagerProps {
  compact?: boolean;
  showTitle?: boolean;
  className?: string;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ 
  compact = false, 
  showTitle = true,
  className = '' 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Set default key if none exists
      const defaultKey = 'AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A';
      setApiKey(defaultKey);
      localStorage.setItem('gemini_api_key', defaultKey);
    }
  }, []);

  const handleEdit = () => {
    setTempKey(apiKey);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
      localStorage.setItem('gemini_api_key', tempKey.trim());
      setIsEditing(false);
      toast({
        title: "🔑 **API Key Updated**",
        description: "Gemini API key has been saved successfully.",
      });
    }
  };

  const handleCancel = () => {
    setTempKey('');
    setIsEditing(false);
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}${'*'.repeat(Math.max(0, key.length - 16))}${key.substring(key.length - 8)}`;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        {apiKey ? (
          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
            API Key: {maskKey(apiKey)}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50 dark:bg-red-900/20">
            No API Key
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="h-6 px-2"
        >
          <Edit className="w-3 h-3" />
        </Button>
        
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 w-96 max-w-[90vw]">
              <h3 className="font-semibold mb-4">Edit Gemini API Key</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="flex-1">
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Gemini API Key</h3>
            {apiKey && !isEditing && (
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
                Configured
              </Badge>
            )}
          </div>
          {apiKey && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Key
            </Button>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Check className="w-4 h-4 mr-1" />
              Save Key
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        apiKey && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border">
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">
                {showKey ? apiKey : maskKey(apiKey)}
              </code>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="h-6 w-6 p-0"
            >
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
        )
      )}

      <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
        Get your free API key from Google AI Studio. Required for AI-powered functions and chat.
      </p>
    </Card>
  );
};

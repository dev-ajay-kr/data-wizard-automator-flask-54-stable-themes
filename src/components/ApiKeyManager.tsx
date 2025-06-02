
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Edit, Check, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  isDefault?: boolean;
}

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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<{[key: string]: boolean}>({});
  const [tempKey, setTempKey] = useState('');
  const [newKeyData, setNewKeyData] = useState({ name: '', key: '', provider: 'Gemini' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    } else {
      // Initialize with default Gemini key if exists
      const geminiKey = localStorage.getItem('gemini_api_key');
      if (geminiKey) {
        const defaultKeys = [{
          id: 'gemini-default',
          name: 'Gemini AI',
          key: geminiKey,
          provider: 'Gemini',
          isDefault: true
        }];
        setApiKeys(defaultKeys);
        localStorage.setItem('api_keys', JSON.stringify(defaultKeys));
      } else {
        // Set default key if none exists
        const defaultKey = 'AIzaSyD7xOyEoBciNbIA4Sdnsw-NnNNqJ7ylX1A';
        const defaultKeys = [{
          id: 'gemini-default',
          name: 'Gemini AI',
          key: defaultKey,
          provider: 'Gemini',
          isDefault: true
        }];
        setApiKeys(defaultKeys);
        localStorage.setItem('api_keys', JSON.stringify(defaultKeys));
        localStorage.setItem('gemini_api_key', defaultKey);
      }
    }
  };

  const saveApiKeys = (keys: ApiKey[]) => {
    setApiKeys(keys);
    localStorage.setItem('api_keys', JSON.stringify(keys));
    
    // Update legacy gemini key storage
    const defaultGemini = keys.find(k => k.provider === 'Gemini' && k.isDefault);
    if (defaultGemini) {
      localStorage.setItem('gemini_api_key', defaultGemini.key);
    }
  };

  const handleEdit = (keyId: string) => {
    const keyToEdit = apiKeys.find(k => k.id === keyId);
    if (keyToEdit) {
      setTempKey(keyToEdit.key);
      setIsEditing(keyId);
    }
  };

  const handleSave = (keyId: string) => {
    if (tempKey.trim()) {
      const updatedKeys = apiKeys.map(k => 
        k.id === keyId ? { ...k, key: tempKey.trim() } : k
      );
      saveApiKeys(updatedKeys);
      setIsEditing(null);
      setTempKey('');
      toast({
        title: "🔑 **API Key Updated**",
        description: "API key has been saved successfully.",
      });
    }
  };

  const handleCancel = () => {
    setTempKey('');
    setIsEditing(null);
    setIsAddingNew(false);
    setNewKeyData({ name: '', key: '', provider: 'Gemini' });
  };

  const handleAddNew = () => {
    if (newKeyData.name.trim() && newKeyData.key.trim()) {
      const newKey: ApiKey = {
        id: `${newKeyData.provider.toLowerCase()}-${Date.now()}`,
        name: newKeyData.name.trim(),
        key: newKeyData.key.trim(),
        provider: newKeyData.provider,
        isDefault: apiKeys.length === 0
      };
      
      saveApiKeys([...apiKeys, newKey]);
      setIsAddingNew(false);
      setNewKeyData({ name: '', key: '', provider: 'Gemini' });
      
      toast({
        title: "🔑 **API Key Added**",
        description: `${newKey.name} has been added successfully.`,
      });
    }
  };

  const handleDelete = (keyId: string) => {
    const updatedKeys = apiKeys.filter(k => k.id !== keyId);
    saveApiKeys(updatedKeys);
    toast({
      title: "🗑️ **API Key Deleted**",
      description: "API key has been removed successfully.",
    });
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '*'.repeat(key.length);
    return `${key.substring(0, 4)}${'*'.repeat(Math.max(0, key.length - 8))}${key.substring(key.length - 4)}`;
  };

  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        {apiKeys.length > 0 ? (
          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
            {apiKeys.length} API Key{apiKeys.length > 1 ? 's' : ''} Configured
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50 dark:bg-red-900/20">
            No API Keys
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">API Configuration</h3>
            {apiKeys.length > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
                {apiKeys.length} Key{apiKeys.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Key
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-white dark:bg-gray-800 p-3 rounded border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{apiKey.name}</span>
                <Badge variant="outline" className="text-xs">{apiKey.provider}</Badge>
                {apiKey.isDefault && (
                  <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleShowKey(apiKey.id)}
                  className="h-6 w-6 p-0"
                >
                  {showKey[apiKey.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(apiKey.id)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                {!apiKey.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {isEditing === apiKey.id ? (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="Enter API key..."
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(apiKey.id)} size="sm" className="flex-1">
                    <Check className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <code className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
              </code>
            )}
          </div>
        ))}

        {isAddingNew && (
          <div className="bg-white dark:bg-gray-800 p-3 rounded border border-dashed">
            <h4 className="font-medium text-sm mb-3">Add New API Key</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="Key Name (e.g., OpenAI GPT)"
                    value={newKeyData.name}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <select
                    value={newKeyData.provider}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Gemini">Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Claude">Claude</option>
                    <option value="Perplexity">Perplexity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <Input
                type="password"
                placeholder="Enter API key..."
                value={newKeyData.key}
                onChange={(e) => setNewKeyData(prev => ({ ...prev, key: e.target.value }))}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddNew} size="sm" className="flex-1">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Key
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
        Securely manage your API keys for different AI services. Keys are stored locally and masked for security.
      </p>
    </Card>
  );
};

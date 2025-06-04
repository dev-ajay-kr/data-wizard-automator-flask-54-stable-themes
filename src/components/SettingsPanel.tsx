
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Key, Plus, RotateCcw, User, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyManager } from '@/components/ApiKeyManager';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFunctionName, setNewFunctionName] = useState('');
  const [newFunctionUrl, setNewFunctionUrl] = useState('');
  const [newFunctionDesc, setNewFunctionDesc] = useState('');
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { toast } = useToast();

  const handleAddFunction = () => {
    if (newFunctionName.trim() && newFunctionUrl.trim()) {
      console.log('Adding new function:', {
        name: newFunctionName,
        url: newFunctionUrl,
        description: newFunctionDesc
      });
      
      toast({
        title: "🔧 **Function Added**",
        description: `**${newFunctionName}** has been added successfully.`,
      });
      
      setNewFunctionName('');
      setNewFunctionUrl('');
      setNewFunctionDesc('');
    } else {
      toast({
        title: "❌ **Missing Information**",
        description: "Please provide function name and endpoint URL.",
        variant: "destructive"
      });
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('currentTheme');
    setTheme('classic');
    toast({
      title: "🔄 **Settings Reset**",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover-scale"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-5 h-5" />
            Application Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* API Key Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">API Configuration</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Configure your Gemini API key for AI-powered analysis and chat functionality
                </p>
              </div>
            </div>
            <ApiKeyManager showTitle={false} className="border-2 border-blue-200 dark:border-blue-700" />
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Selection
            </h3>
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableThemes.map((theme) => (
                  <Card 
                    key={theme.name}
                    className={`p-4 cursor-pointer border-2 transition-all duration-300 hover-scale ${
                      currentTheme === theme.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTheme(theme.name)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">
                          {theme.displayName}
                        </h4>
                        {currentTheme === theme.name && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {theme.description}
                      </p>
                      
                      <div className="flex gap-2">
                        {Object.entries(theme.colors).map(([key, color]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={`${key}: ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Add Custom Function */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Function
            </h3>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="function-name">Function Name</Label>
                  <Input
                    id="function-name"
                    placeholder="e.g., Data Validator"
                    value={newFunctionName}
                    onChange={(e) => setNewFunctionName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="function-url">Endpoint URL</Label>
                  <Input
                    id="function-url"
                    placeholder="https://api.example.com/validate"
                    value={newFunctionUrl}
                    onChange={(e) => setNewFunctionUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="function-desc">Description</Label>
                <Input
                  id="function-desc"
                  placeholder="What does this function do?"
                  value={newFunctionDesc}
                  onChange={(e) => setNewFunctionDesc(e.target.value)}
                />
              </div>
              <Button onClick={handleAddFunction} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Function
              </Button>
            </Card>
          </div>

          {/* User Profile Placeholder */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </h3>
            <Card className="p-4">
              <div className="text-center py-6 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>User profile management coming soon</p>
              </div>
            </Card>
          </div>

          {/* Reset Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset Options
            </h3>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Reset to Defaults</Label>
                  <p className="text-sm text-gray-600">
                    Clear all settings and return to default configuration
                  </p>
                </div>
                <Button
                  onClick={handleResetDefaults}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

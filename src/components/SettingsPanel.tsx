
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Key, Plus, Moon, RotateCcw, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyManager } from '@/components/ApiKeyManager';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFunctionName, setNewFunctionName] = useState('');
  const [newFunctionUrl, setNewFunctionUrl] = useState('');
  const [newFunctionDesc, setNewFunctionDesc] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();

  const handleAddFunction = () => {
    if (newFunctionName.trim() && newFunctionUrl.trim()) {
      // In a real app, this would save to a backend or local storage
      console.log('Adding new function:', {
        name: newFunctionName,
        url: newFunctionUrl,
        description: newFunctionDesc
      });
      
      toast({
        title: "🔧 **Function Added**",
        description: `**${newFunctionName}** has been added successfully.`,
      });
      
      // Reset form
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
    // Reset to default settings
    localStorage.removeItem('gemini_api_key');
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-5 h-5" />
            Application Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* API Key Management */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration
            </h3>
            <ApiKeyManager showTitle={false} />
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

          {/* Theme & Appearance */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Theme & Appearance
            </h3>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={darkMode ? "default" : "outline"}>
                    {darkMode ? "Dark" : "Light"}
                  </Badge>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* User Profile Placeholder */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </h3>
            <Card className="p-4">
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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

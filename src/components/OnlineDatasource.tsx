
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Download, Loader2, FileText, Database, Trash2 } from 'lucide-react';
import { useFiles } from '@/contexts/FileContext';
import { useGemini } from '@/hooks/useGemini';
import { useToast } from '@/hooks/use-toast';

interface OnlineDatasourceProps {
  className?: string;
}

interface DataSource {
  id: string;
  name: string;
  url: string;
  type: 'json' | 'csv';
  description: string;
  lastFetched?: Date;
}

export const OnlineDatasource: React.FC<OnlineDatasourceProps> = ({ className = '' }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Seattle Open Data - All Animals',
      url: 'https://data.seattle.gov/resource/jguv-t9rb.json',
      type: 'json',
      description: 'Complete dataset of Seattle animal data'
    },
    {
      id: '2',
      name: 'Seattle Open Data - Non-Cat/Dog Animals',
      url: 'https://data.seattle.gov/resource/jguv-t9rb.json?$query=SELECT%20*%20WHERE%20Species%20NOT%20IN%20(%27Cat%27,%20%27Dog%27)',
      type: 'json',
      description: 'Filtered dataset excluding cats and dogs'
    }
  ]);

  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'json' | 'csv'>('json');
  const [newDescription, setNewDescription] = useState('');
  const [loadingDataSource, setLoadingDataSource] = useState<string | null>(null);

  const { addFile } = useFiles();
  const { callGemini } = useGemini();
  const { toast } = useToast();

  const generateFileName = async (data: any[], sourceUrl: string, sourceName: string): Promise<string> => {
    try {
      const sampleData = JSON.stringify(data.slice(0, 5), null, 2);
      const prompt = `Based on this dataset sample and source information, suggest a descriptive filename (without extension):
      
Source: ${sourceName}
URL: ${sourceUrl}
Sample Data: ${sampleData}

Provide only the filename, make it descriptive and use underscores instead of spaces.`;

      const response = await callGemini(prompt);
      const suggestedName = response.text?.trim() || 'online_dataset';
      
      // Clean the filename
      return suggestedName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    } catch (error) {
      console.error('Error generating filename:', error);
      return `online_dataset_${Date.now()}`;
    }
  };

  const fetchData = async (dataSource: DataSource) => {
    setLoadingDataSource(dataSource.id);
    
    try {
      const response = await fetch(dataSource.url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let data: any[] = [];
      let content = '';

      if (contentType?.includes('application/json')) {
        const jsonData = await response.json();
        data = Array.isArray(jsonData) ? jsonData : [jsonData];
        content = JSON.stringify(data, null, 2);
      } else {
        // Assume CSV or plain text
        content = await response.text();
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
          const headers = lines[0].split(',');
          data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row: any = {};
            headers.forEach((header, index) => {
              row[header.trim()] = values[index]?.trim() || '';
            });
            return row;
          });
        }
      }

      // Generate filename using Gemini
      const fileName = await generateFileName(data, dataSource.url, dataSource.name);
      
      // Create file object
      const file = {
        id: `online_${Date.now()}`,
        name: `${fileName}.${dataSource.type}`,
        size: content.length,
        type: dataSource.type === 'json' ? 'application/json' : 'text/csv',
        content: content,
        uploadedAt: new Date(),
        parsedData: data
      };

      // Add to files context
      addFile(file);

      // Update last fetched time
      setDataSources(prev => prev.map(ds => 
        ds.id === dataSource.id 
          ? { ...ds, lastFetched: new Date() }
          : ds
      ));

      toast({
        title: "✅ **Data Fetched Successfully**",
        description: `**${file.name}** has been added to your files and is now available for analysis.`,
      });

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "❌ **Fetch Error**",
        description: `Failed to fetch data from **${dataSource.name}**: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoadingDataSource(null);
    }
  };

  const addDataSource = () => {
    if (!newUrl || !newName) {
      toast({
        title: "❌ **Missing Information**",
        description: "Please provide both URL and name for the data source.",
        variant: "destructive"
      });
      return;
    }

    const newDataSource: DataSource = {
      id: Date.now().toString(),
      name: newName,
      url: newUrl,
      type: newType,
      description: newDescription
    };

    setDataSources(prev => [...prev, newDataSource]);
    
    // Reset form
    setNewUrl('');
    setNewName('');
    setNewDescription('');
    
    toast({
      title: "🌐 **Data Source Added**",
      description: `**${newName}** has been added to your online data sources.`,
    });
  };

  const removeDataSource = (id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
    toast({
      title: "🗑️ **Data Source Removed**",
      description: "Data source has been removed from your list.",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Add New Data Source */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Online Data Source</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="datasource-name">Data Source Name</Label>
            <Input
              id="datasource-name"
              placeholder="e.g., Seattle Animal Data"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datasource-type">Data Type</Label>
            <Select value={newType} onValueChange={(value: 'json' | 'csv') => setNewType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="datasource-url">API URL</Label>
            <Input
              id="datasource-url"
              placeholder="https://api.example.com/data.json"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="datasource-description">Description (Optional)</Label>
            <Input
              id="datasource-description"
              placeholder="Brief description of this data source"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={addDataSource} className="mt-4 w-full">
          <Globe className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>
      </Card>

      {/* Data Sources List */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Data Sources</h3>
          <Badge variant="outline" className="ml-auto">
            {dataSources.length} Sources
          </Badge>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {dataSources.map((dataSource) => (
              <Card key={dataSource.id} className="p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {dataSource.name}
                      </h4>
                      <Badge variant="outline" className={`${
                        dataSource.type === 'json' 
                          ? 'text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20'
                          : 'text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      }`}>
                        {dataSource.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {dataSource.description}
                    </p>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-mono break-all">
                      {dataSource.url}
                    </p>
                    
                    {dataSource.lastFetched && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        Last fetched: {dataSource.lastFetched.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => fetchData(dataSource)}
                      disabled={loadingDataSource === dataSource.id}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loadingDataSource === dataSource.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Fetch Data
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => removeDataSource(dataSource.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

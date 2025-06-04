
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FileText, Download, Upload, Settings, Search, Filter, RefreshCw, Home, BarChart, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFiles } from '@/contexts/FileContext';
import { ResponseFormatter } from './ResponseFormatter';
import { AnalysisFunctions } from './AnalysisFunctions';
import { OnlineDatasource } from './OnlineDatasource';
import { DashboardPreview } from './DashboardPreview';
import { useTheme } from '@/contexts/ThemeContext';

export const DatasourceUtilities: React.FC = () => {
  const navigate = useNavigate();
  const { files } = useFiles();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const { currentTheme } = useTheme();

  // Mock data for demonstration
  const mockPreviewData = {
    tables: [
      {
        table_name: "DailyStockPrices",
        columns: ["Date", "Symbol", "Open", "High", "Low", "Close", "Volume"],
        row_count: 1500,
        sample_data: [
          ["2024-01-01", "AAPL", 180.50, 185.20, 179.80, 184.10, 52000000],
          ["2024-01-01", "GOOGL", 142.30, 145.80, 141.50, 144.20, 28000000],
          ["2024-01-01", "MSFT", 375.20, 378.90, 374.10, 377.50, 31000000]
        ]
      }
    ],
    summary: "Database contains 1 table with 1,500 stock price records",
    last_updated: "2024-06-01T14:25:30"
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    // Simulate data preview
    setPreviewData(mockPreviewData);
  };

  return (
    <div className={`min-h-screen theme-responsive-bg theme-${currentTheme}`}>
      {/* Header */}
      <header className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b dark:border-gray-700 theme-${currentTheme}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover-scale theme-button-nav"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent theme-text-primary">
                Datasource Utilities
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover-scale theme-button-secondary">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover-scale theme-button-secondary">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className={`max-w-7xl mx-auto p-6 theme-${currentTheme}`}>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className={`grid w-full grid-cols-3 mb-6 theme-${currentTheme}`}>
            <TabsTrigger value="dashboard" className={`flex items-center gap-2 theme-tab`}>
              <BarChart3 className="w-4 h-4" />
              Dashboard Preview
            </TabsTrigger>
            <TabsTrigger value="analysis" className={`flex items-center gap-2 theme-tab`}>
              <BarChart className="w-4 h-4" />
              Analysis & Functions
            </TabsTrigger>
            <TabsTrigger value="management" className={`flex items-center gap-2 theme-tab`}>
              <Database className="w-4 h-4" />
              Data Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className={`theme-${currentTheme}`}>
            <DashboardPreview />
          </TabsContent>

          <TabsContent value="analysis" className={`theme-${currentTheme}`}>
            <AnalysisFunctions />
          </TabsContent>

          <TabsContent value="management" className={`theme-${currentTheme}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
              {/* Left Panel - Utilities */}
              <div className="space-y-6 overflow-hidden">
                <Card className={`p-6 theme-card theme-${currentTheme} h-full`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h2 className={`text-xl font-bold theme-text-primary`}>Data Source Management</h2>
                  </div>

                  <Tabs defaultValue="files" className="w-full h-full flex flex-col">
                    <TabsList className={`grid w-full grid-cols-2 mb-6 flex-shrink-0 theme-${currentTheme}`}>
                      <TabsTrigger value="files" className={`flex items-center gap-2 theme-tab`}>
                        <FileText className="w-4 h-4" />
                        Files
                      </TabsTrigger>
                      <TabsTrigger value="online" className={`flex items-center gap-2 theme-tab`}>
                        <Globe className="w-4 h-4" />
                        Online Datasource
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="files" className="space-y-4 flex-1 overflow-hidden">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input placeholder="Search files..." className={`pl-10 theme-input`} />
                        </div>
                        <Button variant="outline" size="sm" className="theme-button-secondary">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>

                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-3">
                          <div className={`text-sm font-medium theme-text-secondary mb-3`}>
                            Uploaded Files ({files.length})
                          </div>
                          
                          {files.length === 0 ? (
                            <div className={`text-center py-8 theme-text-muted`}>
                              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No files uploaded yet</p>
                              <p className="text-sm">Upload files from the CSV Upload tab or fetch from Online Datasource</p>
                            </div>
                          ) : (
                            files.map((file, index) => (
                              <Card
                                key={index}
                                className={`p-4 cursor-pointer transition-all hover-scale border-2 theme-card ${
                                  selectedFile?.name === file.name
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                                onClick={() => handleFileSelect(file)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <div>
                                      <div className={`font-medium theme-text-primary`}>
                                        {file.name}
                                      </div>
                                      <div className={`text-sm theme-text-muted`}>
                                        {(file.size / 1024).toFixed(2)} KB
                                        {file.parsedData && ` • ${file.parsedData.length} rows`}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20 theme-badge">
                                    Processed
                                  </Badge>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="online" className="space-y-4 flex-1 overflow-hidden">
                      <ScrollArea className="flex-1 pr-4">
                        <OnlineDatasource />
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="space-y-6 overflow-hidden">
                <Card className={`p-6 theme-card theme-${currentTheme} h-full flex flex-col`}>
                  <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h2 className={`text-xl font-bold theme-text-primary`}>Data Preview</h2>
                    </div>
                    {previewData && (
                      <Button variant="outline" size="sm" className="flex items-center gap-2 hover-scale theme-button-secondary">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    )}
                  </div>

                  <ScrollArea className="flex-1">
                    {!previewData ? (
                      <div className={`flex items-center justify-center h-full theme-text-muted`}>
                        <div className="text-center">
                          <Database className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                          <p className="text-lg mb-2">Select a data source</p>
                          <p className="text-sm">Choose a file or fetch online data to preview</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className={`p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 theme-card`}>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {previewData.tables?.length || 0}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Tables</div>
                          </Card>
                          <Card className={`p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 theme-card`}>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {previewData.tables?.[0]?.row_count || 0}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">Records</div>
                          </Card>
                          <Card className={`p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 theme-card`}>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {previewData.tables?.[0]?.columns?.length || 0}
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">Columns</div>
                          </Card>
                        </div>

                        {previewData.tables?.map((table: any, index: number) => (
                          <div key={index} className="space-y-4">
                            <h3 className={`text-lg font-semibold theme-text-primary`}>
                              {table.table_name}
                            </h3>
                            
                            <div className="overflow-x-auto">
                              <table className={`min-w-full border-collapse border theme-border rounded-lg`}>
                                <thead className={`theme-card`}>
                                  <tr>
                                    {table.columns?.map((column: string, colIndex: number) => (
                                      <th
                                        key={colIndex}
                                        className={`border theme-border px-4 py-2 text-left font-semibold theme-text-primary`}
                                      >
                                        {column}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.sample_data?.slice(0, 5).map((row: any[], rowIndex: number) => (
                                    <tr key={rowIndex} className={`hover:theme-hover`}>
                                      {row.map((cell: any, cellIndex: number) => (
                                        <td
                                          key={cellIndex}
                                          className={`border theme-border px-4 py-2 theme-text-secondary`}
                                        >
                                          {typeof cell === 'number' ? cell.toLocaleString() : cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className={`text-sm theme-text-muted`}>
                              Showing 5 of {table.row_count?.toLocaleString()} records
                            </div>
                          </div>
                        ))}

                        <div className={`pt-4 border-t theme-border`}>
                          <ResponseFormatter
                            content={`## Data Summary\n\n${previewData.summary}\n\n**Last Updated:** ${previewData.last_updated || '—'}`}
                            enableExports={true}
                            title="Datasource_Preview"
                          />
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

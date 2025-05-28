
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  preview?: string[][];
  uploadedAt: Date;
  parsedData?: any[];
}

interface FileContextType {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  getFile: (id: string) => UploadedFile | undefined;
  clearFiles: () => void;
  getFileData: () => string;
  getParsedData: () => any[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

const parseCSVContent = (content: string): any[] => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
};

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFile = (file: UploadedFile) => {
    // Parse data based on file type
    let parsedData: any[] = [];
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      parsedData = parseCSVContent(file.content);
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        const jsonData = JSON.parse(file.content);
        parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } catch (e) {
        console.error('Error parsing JSON file:', e);
      }
    }
    
    const fileWithParsedData = { ...file, parsedData };
    setFiles(prev => [...prev, fileWithParsedData]);
    
    console.log('File added with parsed data:', {
      name: file.name,
      rowCount: parsedData.length,
      columns: parsedData.length > 0 ? Object.keys(parsedData[0]) : []
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFile = (id: string) => {
    return files.find(file => file.id === id);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const getFileData = () => {
    return files.map(file => {
      const preview = file.preview?.slice(0, 10).map(row => row.join(',')).join('\n') || '';
      return `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\nColumns: ${file.preview?.[0]?.length || 0}\nRows: ${file.preview?.length || 0}\nPreview:\n${preview}`;
    }).join('\n\n');
  };

  const getParsedData = () => {
    return files.flatMap(file => file.parsedData || []);
  };

  return (
    <FileContext.Provider value={{ 
      files, 
      addFile, 
      removeFile, 
      getFile, 
      clearFiles, 
      getFileData, 
      getParsedData 
    }}>
      {children}
    </FileContext.Provider>
  );
};

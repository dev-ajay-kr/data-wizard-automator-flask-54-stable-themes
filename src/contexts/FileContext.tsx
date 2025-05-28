
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  preview?: string[][];
  uploadedAt: Date;
}

interface FileContextType {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  getFile: (id: string) => UploadedFile | undefined;
  clearFiles: () => void;
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

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFile = (file: UploadedFile) => {
    setFiles(prev => [...prev, file]);
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

  return (
    <FileContext.Provider value={{ files, addFile, removeFile, getFile, clearFiles }}>
      {children}
    </FileContext.Provider>
  );
};

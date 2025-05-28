
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useFiles } from '@/contexts/FileContext';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  className?: string;
  compact?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ className = '', compact = false }) => {
  const { files, addFile, removeFile } = useFiles();
  const { toast } = useToast();

  const handleFileUpload = useCallback((uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          content,
          uploadedAt: new Date(),
        };

        // For CSV files, create preview
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const lines = content.split('\n').slice(0, 6);
          newFile.preview = lines.map(line => line.split(',').slice(0, 5));
        }

        addFile(newFile);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is now available across all modules.`,
        });
      };
      reader.readAsText(file);
    });
  }, [addFile, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  if (compact) {
    return (
      <div className={className}>
        <input
          type="file"
          multiple
          accept=".csv,.txt,.json"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload-compact"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="file-upload-compact" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </label>
        </Button>
        
        {files.length > 0 && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {files.length} file(s) uploaded
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        type="file"
        multiple
        accept=".csv,.txt,.json"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <Button asChild className="bg-blue-600 hover:bg-blue-700">
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </label>
      </Button>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Uploaded Files:</h4>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

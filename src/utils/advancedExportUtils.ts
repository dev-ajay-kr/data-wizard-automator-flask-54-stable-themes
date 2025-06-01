
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

// Generate timestamp for filenames
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '').replace('T', 'T').split('.')[0];
};

// Safe fallback for any value
export const safeFallback = (value: any, type: 'date' | 'number' | 'text' = 'text'): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  
  if (type === 'date') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString();
  }
  
  if (type === 'number') {
    const num = Number(value);
    if (isNaN(num)) {
      return '—';
    }
    return num.toString();
  }
  
  return String(value);
};

// Convert HTML to Word-compatible format
const htmlToWordXml = (html: string): string => {
  // Basic HTML to Word XML conversion
  let wordXml = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<w:r><w:rPr><w:b/></w:rPr><w:t>$1</w:t></w:r>')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '<w:r><w:rPr><w:i/></w:rPr><w:t>$1</w:t></w:r>')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '<w:p><w:r><w:t>$1</w:t></w:r></w:p>')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '<w:r><w:rPr><w:rFonts w:ascii="Consolas"/><w:shd w:fill="F0F0F0"/></w:rPr><w:t>$1</w:t></w:r>')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>');
  
  // Remove remaining HTML tags
  wordXml = wordXml.replace(/<[^>]*>/g, '');
  
  return wordXml;
};

export const exportToWord = async (content: string, filename: string) => {
  try {
    console.log('Exporting to Word:', filename);
    
    // Convert markdown/HTML to Word XML
    const wordContent = htmlToWordXml(content);
    
    // Create a basic Word document structure
    const wordDocument = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${wordContent}
  </w:body>
</w:document>`;
    
    // For now, export as RTF which most word processors can open
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
${content.replace(/\*\*(.*?)\*\*/g, '{\\b $1}')
         .replace(/\*(.*?)\*/g, '{\\i $1}')
         .replace(/`(.*?)`/g, '{\\f1 $1}')
         .replace(/\n/g, '\\par ')}}`;
    
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_${getTimestamp()}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "📄 **Word Export Complete**",
      description: `Document exported as **${filename}.rtf**`,
    });
  } catch (error) {
    console.error('Word export error:', error);
    toast({
      title: "❌ **Word Export Failed**",
      description: "Failed to export Word document. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportToPNG = async (chartElementId: string, filename: string) => {
  try {
    console.log('PNG export requested for chart:', chartElementId, filename);
    
    const chartElement = document.getElementById(chartElementId);
    if (!chartElement) {
      throw new Error(`Chart element with ID "${chartElementId}" not found`);
    }
    
    // Generate canvas from chart element with high resolution
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 3, // Higher resolution for better quality
      width: 1200,
      height: 800,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_${getTimestamp()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "🖼️ **Chart Export Complete**",
          description: `Chart saved as **${filename}.png**`,
        });
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('PNG export error:', error);
    toast({
      title: "❌ **PNG Export Failed**",
      description: "Failed to export chart. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportToCSV = async (data: any, filename: string) => {
  try {
    console.log('Exporting to CSV:', filename, data);
    let csvContent = '';
    
    if (typeof data === 'string') {
      // Try to parse as table data
      const lines = data.split('\n').filter(line => line.trim());
      if (lines.some(line => line.includes('|'))) {
        // Markdown table format
        const tableLines = lines.filter(line => line.includes('|') && !line.match(/^\s*\|[\s\-\|]*\|\s*$/));
        csvContent = tableLines.map(line => 
          line.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell)
            .map(cell => cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell)
            .join(',')
        ).join('\n');
      } else {
        csvContent = data;
      }
    } else if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = safeFallback(row[header]);
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ];
      csvContent = csvRows.join('\n');
    } else {
      csvContent = JSON.stringify(data, null, 2);
    }
    
    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_${getTimestamp()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "📊 **CSV Export Complete**",
      description: `Data exported as **${filename}.csv**`,
    });
  } catch (error) {
    console.error('CSV export error:', error);
    toast({
      title: "❌ **CSV Export Failed**",
      description: "Failed to export CSV data. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportToText = async (data: any, filename: string) => {
  try {
    console.log('Exporting to text:', filename, data);
    let textContent = '';
    
    if (typeof data === 'string') {
      textContent = data;
    } else if (typeof data === 'object') {
      textContent = JSON.stringify(data, null, 2);
    } else {
      textContent = String(data);
    }
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_${getTimestamp()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "📄 **Text Export Complete**",
      description: `Data exported as **${filename}.txt**`,
    });
  } catch (error) {
    console.error('Text export error:', error);
    toast({
      title: "❌ **Text Export Failed**",
      description: "Failed to export text data. Please try again.",
      variant: "destructive"
    });
  }
};

// Detect if content contains tabular data
export const detectTableData = (content: string): boolean => {
  // Check for markdown table format
  if (content.includes('|') && content.match(/\|.*\|.*\n.*\|.*[-:]+.*\|/)) {
    return true;
  }
  // Check for HTML table
  if (content.includes('<table') || content.includes('<th>') || content.includes('<td>')) {
    return true;
  }
  // Check for CSV-like data
  if (content.split('\n').some(line => line.split(',').length > 2)) {
    return true;
  }
  return false;
};

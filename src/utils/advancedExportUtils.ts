
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

// Enhanced markdown to HTML conversion
const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Lists
    .replace(/^\s*[\*\-\+]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraphs
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }

  return html;
};

// Enhanced Word export with proper RTF formatting
export const exportToWord = async (content: string, filename: string) => {
  try {
    console.log('Exporting to Word:', filename);
    
    // Convert markdown to HTML first
    const htmlContent = markdownToHtml(content);
    
    // Create RTF content with proper formatting
    let rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl {\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fmodern\\fcharset0 Courier New;}}
{\\colortbl;\\red0\\green0\\blue0;\\red0\\green0\\blue255;}
\\f0\\fs24`;

    // Process the HTML content for RTF
    rtfContent += htmlContent
      // Headers
      .replace(/<h1>(.*?)<\/h1>/g, '\\par\\fs32\\b $1\\b0\\fs24\\par')
      .replace(/<h2>(.*?)<\/h2>/g, '\\par\\fs28\\b $1\\b0\\fs24\\par')
      .replace(/<h3>(.*?)<\/h3>/g, '\\par\\fs24\\b $1\\b0\\fs24\\par')
      
      // Bold and italic
      .replace(/<strong>(.*?)<\/strong>/g, '\\b $1\\b0')
      .replace(/<em>(.*?)<\/em>/g, '\\i $1\\i0')
      
      // Code
      .replace(/<code>(.*?)<\/code>/g, '\\f1\\highlight2 $1\\f0\\highlight0')
      
      // Lists
      .replace(/<ul>/g, '')
      .replace(/<\/ul>/g, '')
      .replace(/<li>(.*?)<\/li>/g, '\\par\\bullet\\tab $1')
      
      // Paragraphs and breaks
      .replace(/<p>/g, '\\par')
      .replace(/<\/p>/g, '')
      .replace(/<br>/g, '\\par')
      
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '');

    rtfContent += '}';
    
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
      title: "📄 Word Export Complete",
      description: `Document exported as ${filename}.rtf`,
    });
  } catch (error) {
    console.error('Word export error:', error);
    toast({
      title: "❌ Word Export Failed", 
      description: "Failed to export Word document. Please try again.",
      variant: "destructive"
    });
  }
};

// Enhanced PNG export with better capture settings
export const exportToPNG = async (elementId: string, filename: string) => {
  try {
    console.log('PNG export requested for element:', elementId, filename);
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }
    
    // Create a larger container to ensure nothing is cropped
    const container = element.cloneNode(true) as HTMLElement;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1400px';
    container.style.minHeight = '900px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-1';
    
    document.body.appendChild(container);
    
    // Generate high-quality canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: 1400,
      height: 900,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    });
    
    // Clean up
    document.body.removeChild(container);
    
    // Convert to blob and download
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
          title: "🖼️ Chart Export Complete",
          description: `Chart saved as ${filename}.png`,
        });
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('PNG export error:', error);
    toast({
      title: "❌ PNG Export Failed",
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

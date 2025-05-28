
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

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
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "✅ **Export Complete**",
      description: `📄 Results exported as **${filename}.txt**`,
    });
  } catch (error) {
    console.error('Text export error:', error);
    toast({
      title: "❌ **Export Failed**",
      description: "Failed to export text data. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportToExcel = async (data: any, filename: string) => {
  try {
    console.log('Exporting to Excel:', filename, data);
    let csvContent = '';
    
    if (typeof data === 'string') {
      csvContent = data;
    } else if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes in CSV
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
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "📊 **Export Complete**",
      description: `📈 Results exported as **${filename}.csv**`,
    });
  } catch (error) {
    console.error('Excel export error:', error);
    toast({
      title: "❌ **Export Failed**",
      description: "Failed to export Excel data. Please try again.",
      variant: "destructive"
    });
  }
};

export const exportChartAsPNG = async (chartElementId: string, filename: string) => {
  try {
    console.log('PNG export requested for chart:', chartElementId, filename);
    
    const chartElement = document.getElementById(chartElementId);
    if (!chartElement) {
      throw new Error(`Chart element with ID "${chartElementId}" not found`);
    }
    
    // Generate canvas from chart element
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
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
        a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "🖼️ **Chart Export Complete**",
          description: `📊 Chart saved as **${filename}.png**`,
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

// Utility function to generate unique chart IDs
export const generateChartId = (prefix: string = 'chart') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

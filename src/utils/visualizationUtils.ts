
import { ErrorHandler } from './errorHandling';

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'histogram';
  title: string;
  xAxis?: string;
  yAxis?: string;
  colorBy?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export class VisualizationHelper {
  static generateChartData(data: any[], config: ChartConfig): ChartData {
    try {
      switch (config.type) {
        case 'bar':
        case 'line':
        case 'area':
          return this.generateXYChartData(data, config);
        case 'pie':
          return this.generatePieChartData(data, config);
        case 'scatter':
          return this.generateScatterData(data, config);
        case 'histogram':
          return this.generateHistogramData(data, config);
        default:
          throw new Error(`Unsupported chart type: ${config.type}`);
      }
    } catch (error) {
      console.error('Error generating chart data:', error);
      return { labels: [], datasets: [] };
    }
  }

  private static generateXYChartData(data: any[], config: ChartConfig): ChartData {
    if (!config.xAxis || !config.yAxis) {
      throw new Error('X and Y axis are required for XY charts');
    }

    const groupedData = new Map<string, number[]>();
    
    data.forEach(row => {
      const xValue = String(row[config.xAxis!]);
      const yValue = Number(row[config.yAxis!]);
      
      if (!isNaN(yValue)) {
        if (!groupedData.has(xValue)) {
          groupedData.set(xValue, []);
        }
        groupedData.get(xValue)!.push(yValue);
      }
    });

    const labels = Array.from(groupedData.keys()).sort();
    const processedData = labels.map(label => {
      const values = groupedData.get(label)!;
      switch (config.aggregation) {
        case 'sum':
          return values.reduce((a, b) => a + b, 0);
        case 'avg':
          return values.reduce((a, b) => a + b, 0) / values.length;
        case 'count':
          return values.length;
        case 'min':
          return Math.min(...values);
        case 'max':
          return Math.max(...values);
        default:
          return values.reduce((a, b) => a + b, 0);
      }
    });

    return {
      labels,
      datasets: [{
        label: config.title,
        data: processedData,
        backgroundColor: this.generateColors(labels.length, 0.6),
        borderColor: this.generateColors(labels.length, 1),
        borderWidth: 2
      }]
    };
  }

  private static generatePieChartData(data: any[], config: ChartConfig): ChartData {
    if (!config.xAxis) {
      throw new Error('X axis is required for pie charts');
    }

    const counts = new Map<string, number>();
    
    data.forEach(row => {
      const value = String(row[config.xAxis!]);
      counts.set(value, (counts.get(value) || 0) + 1);
    });

    const labels = Array.from(counts.keys());
    const chartData = labels.map(label => counts.get(label)!);

    return {
      labels,
      datasets: [{
        label: config.title,
        data: chartData,
        backgroundColor: this.generateColors(labels.length, 0.6),
        borderColor: this.generateColors(labels.length, 1),
        borderWidth: 1
      }]
    };
  }

  private static generateScatterData(data: any[], config: ChartConfig): ChartData {
    if (!config.xAxis || !config.yAxis) {
      throw new Error('X and Y axis are required for scatter plots');
    }

    const scatterData = data
      .filter(row => !isNaN(Number(row[config.xAxis!])) && !isNaN(Number(row[config.yAxis!])))
      .map(row => ({
        x: Number(row[config.xAxis!]),
        y: Number(row[config.yAxis!])
      }));

    return {
      labels: [],
      datasets: [{
        label: config.title,
        data: scatterData as any,
        backgroundColor: this.generateColors(1, 0.6),
        borderColor: this.generateColors(1, 1),
        borderWidth: 1
      }]
    };
  }

  private static generateHistogramData(data: any[], config: ChartConfig): ChartData {
    if (!config.xAxis) {
      throw new Error('X axis is required for histograms');
    }

    const values = data
      .map(row => Number(row[config.xAxis!]))
      .filter(val => !isNaN(val))
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return { labels: [], datasets: [] };
    }

    const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
    const min = values[0];
    const max = values[values.length - 1];
    const binWidth = (max - min) / binCount;

    const bins: number[] = new Array(binCount).fill(0);
    const binLabels: string[] = [];

    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      const binEnd = min + (i + 1) * binWidth;
      binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
      bins[binIndex]++;
    });

    return {
      labels: binLabels,
      datasets: [{
        label: config.title,
        data: bins,
        backgroundColor: this.generateColors(binCount, 0.6),
        borderColor: this.generateColors(binCount, 1),
        borderWidth: 1
      }]
    };
  }

  private static generateColors(count: number, alpha: number): string[] {
    const colors = [
      `hsla(220, 70%, 50%, ${alpha})`, // Blue
      `hsla(140, 70%, 50%, ${alpha})`, // Green
      `hsla(10, 70%, 50%, ${alpha})`,  // Red
      `hsla(45, 70%, 50%, ${alpha})`,  // Orange
      `hsla(280, 70%, 50%, ${alpha})`, // Purple
      `hsla(190, 70%, 50%, ${alpha})`, // Cyan
      `hsla(60, 70%, 50%, ${alpha})`,  // Yellow
      `hsla(320, 70%, 50%, ${alpha})`, // Pink
    ];

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }

  static suggestChartType(data: any[], xColumn: string, yColumn?: string): ChartConfig['type'] {
    if (!data || data.length === 0) return 'bar';

    const xValues = data.map(row => row[xColumn]).filter(val => val !== null && val !== undefined);
    const uniqueXValues = new Set(xValues);
    
    // If no Y column, suggest pie chart for categorical data
    if (!yColumn) {
      return uniqueXValues.size <= 10 ? 'pie' : 'bar';
    }

    const yValues = data.map(row => row[yColumn]).filter(val => !isNaN(Number(val)));
    const isXNumeric = xValues.every(val => !isNaN(Number(val)));
    const isYNumeric = yValues.length > 0;

    // Both numeric - scatter plot
    if (isXNumeric && isYNumeric && uniqueXValues.size > 10) {
      return 'scatter';
    }

    // Time series data - line chart
    if (xValues.some(val => !isNaN(Date.parse(val)))) {
      return 'line';
    }

    // Categorical X with numeric Y - bar chart
    if (!isXNumeric && isYNumeric) {
      return 'bar';
    }

    // Default to bar chart
    return 'bar';
  }

  static generateInsights(data: any[], config: ChartConfig): string[] {
    const insights: string[] = [];

    if (!data || data.length === 0) {
      insights.push('No data available for analysis');
      return insights;
    }

    try {
      // General insights
      insights.push(`Dataset contains ${data.length} records`);

      if (config.xAxis) {
        const xValues = data.map(row => row[config.xAxis!]);
        const uniqueX = new Set(xValues);
        insights.push(`${uniqueX.size} unique values in ${config.xAxis}`);
      }

      if (config.yAxis) {
        const yValues = data.map(row => Number(row[config.yAxis!])).filter(val => !isNaN(val));
        if (yValues.length > 0) {
          const min = Math.min(...yValues);
          const max = Math.max(...yValues);
          const avg = yValues.reduce((a, b) => a + b, 0) / yValues.length;
          
          insights.push(`${config.yAxis} ranges from ${min.toFixed(2)} to ${max.toFixed(2)}`);
          insights.push(`Average ${config.yAxis}: ${avg.toFixed(2)}`);
        }
      }

      // Chart-specific insights
      switch (config.type) {
        case 'pie':
          const pieData = this.generatePieChartData(data, config);
          const topCategory = pieData.labels[pieData.datasets[0].data.indexOf(Math.max(...pieData.datasets[0].data))];
          insights.push(`Most common category: ${topCategory}`);
          break;
          
        case 'bar':
        case 'line':
          if (config.xAxis && config.yAxis) {
            const chartData = this.generateXYChartData(data, config);
            const maxValue = Math.max(...chartData.datasets[0].data);
            const maxIndex = chartData.datasets[0].data.indexOf(maxValue);
            insights.push(`Highest value: ${chartData.labels[maxIndex]} (${maxValue})`);
          }
          break;
      }
    } catch (error) {
      insights.push('Error generating insights');
      console.error('Insight generation error:', error);
    }

    return insights;
  }
}

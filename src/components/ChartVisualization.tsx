
import React, { useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Download, Image as ImageIcon } from 'lucide-react';
import { exportChartAsPNG, exportToExcel, generateChartId } from '@/utils/exportUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xKey?: string;
  yKey?: string;
  config?: any;
  id?: string;
}

interface ChartVisualizationProps {
  charts: ChartData[];
  className?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const ChartVisualization: React.FC<ChartVisualizationProps> = ({ charts, className = '' }) => {
  const { currentTheme } = useTheme();
  const is3DEnabled = currentTheme === 'nature'; // Enable 3D for nature theme
  
  const renderChart = (chart: ChartData, index: number) => {
    const chartConfig = {
      [chart.yKey || 'value']: {
        label: chart.title,
        color: COLORS[index % COLORS.length],
      },
    };

    // Use theme-specific styling for charts
    const chartClassName = `h-64 w-full ${is3DEnabled ? 'theme-3d-chart' : ''}`;

    switch (chart.type) {
      case 'bar':
        return (
          <ChartContainer config={chartConfig} className={chartClassName}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey={chart.xKey || 'name'} 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey={chart.yKey || 'value'} 
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  className={is3DEnabled ? 'theme-3d-bar' : ''}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'line':
        return (
          <ChartContainer config={chartConfig} className={chartClassName}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey={chart.xKey || 'name'} 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey={chart.yKey || 'value'} 
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={is3DEnabled ? 4 : 3}
                  dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: is3DEnabled ? 5 : 4 }}
                  className={is3DEnabled ? 'theme-3d-line' : ''}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'area':
        return (
          <ChartContainer config={chartConfig} className={chartClassName}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey={chart.xKey || 'name'} 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey={chart.yKey || 'value'} 
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={is3DEnabled ? 0.5 : 0.3}
                  className={is3DEnabled ? 'theme-3d-area' : ''}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className={chartClassName}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey={chart.yKey || 'value'}
                  nameKey={chart.xKey || 'name'}
                  cx="50%"
                  cy="50%"
                  outerRadius={is3DEnabled ? 85 : 80}
                  innerRadius={is3DEnabled ? 10 : 0}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  className={is3DEnabled ? 'theme-3d-pie' : ''}
                >
                  {chart.data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      default:
        return null;
    }
  };

  if (!charts || charts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        📊 No chart data available
      </div>
    );
  }

  // Ensure each chart has a unique ID
  const chartsWithIds = charts.map((chart, index) => ({
    ...chart,
    id: chart.id || generateChartId(`chart-${index}`)
  }));

  // Apply theme-specific card styling
  const cardClassName = `p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 theme-card ${is3DEnabled ? 'theme-3d-card' : ''}`;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartsWithIds.map((chart, index) => (
          <Card key={index} id={chart.id} className={cardClassName}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 theme-text-primary">
                {chart.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs theme-badge">
                  {chart.type.toUpperCase()}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportToExcel(chart.data, chart.title)}
                    className="h-7 px-2 theme-button-secondary"
                    title="Export as Excel"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportChartAsPNG(chart.id!, chart.title)}
                    className="h-7 px-2 theme-button-secondary"
                    title="Export as PNG"
                  >
                    <ImageIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            {renderChart(chart, index)}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 theme-text-secondary">
              📈 {chart.data.length} data points
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

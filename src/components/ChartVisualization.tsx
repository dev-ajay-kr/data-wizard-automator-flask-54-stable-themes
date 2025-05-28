
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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
}

interface ChartVisualizationProps {
  charts: ChartData[];
  className?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const ChartVisualization: React.FC<ChartVisualizationProps> = ({ charts, className = '' }) => {
  const renderChart = (chart: ChartData, index: number) => {
    const chartConfig = {
      [chart.yKey || 'value']: {
        label: chart.title,
        color: COLORS[index % COLORS.length],
      },
    };

    switch (chart.type) {
      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="h-64 w-full">
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
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'line':
        return (
          <ChartContainer config={chartConfig} className="h-64 w-full">
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
                  strokeWidth={3}
                  dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'area':
        return (
          <ChartContainer config={chartConfig} className="h-64 w-full">
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
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
        
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey={chart.yKey || 'value'}
                  nameKey={chart.xKey || 'name'}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        No chart data available
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <Card key={index} className="p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {chart.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {chart.type.toUpperCase()}
              </Badge>
            </div>
            {renderChart(chart, index)}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {chart.data.length} data points
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

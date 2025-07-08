
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();

  startMeasure(name: string): void {
    const startTime = performance.now();
    this.metrics.set(name, {
      name,
      startTime
    });
    console.log(`⏱️ Started measuring: ${name}`);
  }

  endMeasure(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ No measurement started for: ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    const completedMetric = {
      ...metric,
      endTime,
      duration
    };
    
    this.metrics.set(name, completedMetric);
    console.log(`✅ Completed measuring: ${name} (${duration.toFixed(2)}ms)`);
    
    return duration;
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  logSummary(): void {
    console.group('📊 Performance Summary');
    this.getAllMetrics().forEach(metric => {
      if (metric.duration) {
        console.log(`${metric.name}: ${metric.duration.toFixed(2)}ms`);
      }
    });
    console.groupEnd();
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Higher-order component for measuring component render time
export const withPerformanceTracking = <T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) => {
  return (props: T) => {
    performanceMonitor.startMeasure(`render-${componentName}`);
    
    React.useEffect(() => {
      performanceMonitor.endMeasure(`render-${componentName}`);
    });

    return <WrappedComponent {...props} />;
  };
};

// Hook for measuring custom operations
export const usePerformance = () => {
  const measure = React.useCallback((name: string, fn: () => Promise<any> | any) => {
    return async () => {
      performanceMonitor.startMeasure(name);
      try {
        const result = await fn();
        return result;
      } finally {
        performanceMonitor.endMeasure(name);
      }
    };
  }, []);

  return { measure, monitor: performanceMonitor };
};


import { FunctionItem } from './types';

export const etlFunctions: FunctionItem[] = [
  {
    id: 'data-cleansing',
    name: 'Data Cleansing',
    description: 'Clean and standardize your data by removing duplicates, handling missing values, and fixing inconsistencies.',
    category: 'ETL',
    status: 'active',
    details: 'Comprehensive data quality improvement including duplicate detection, missing value handling, format standardization, and outlier identification. Uses advanced algorithms to ensure your data meets quality standards.'
  },
  {
    id: 'data-transformation',
    name: 'Data Transformation',
    description: 'Transform data structure and format to meet your business requirements.',
    category: 'ETL',
    status: 'active',
    details: 'Advanced data transformation capabilities including normalization, denormalization, data type conversions, business rule applications, and structural modifications to optimize data for analysis.'
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Validate data integrity and business rule compliance across your datasets.',
    category: 'ETL',
    status: 'beta',
    details: 'Comprehensive validation framework that checks data integrity, enforces business rules, validates constraints, and provides detailed quality scores with actionable recommendations.'
  }
];

export const analyticsFunctions: FunctionItem[] = [
  {
    id: 'statistical-analysis',
    name: 'Statistical Analysis',
    description: 'Perform comprehensive statistical analysis including descriptive statistics and correlations.',
    category: 'Analytics',
    status: 'active',
    details: 'Advanced statistical analysis including descriptive statistics, distribution analysis, correlation matrices, hypothesis testing, and significance testing with detailed interpretations.'
  },
  {
    id: 'correlation-analysis',
    name: 'Correlation Analysis',
    description: 'Analyze relationships and dependencies between variables in your datasets.',
    category: 'Analytics',
    status: 'active',
    details: 'Deep correlation analysis using Pearson, Spearman, and Kendall correlation methods. Identifies strong relationships, dependencies, and provides insights for feature selection.'
  },
  {
    id: 'outlier-detection',
    name: 'Outlier Detection',
    description: 'Identify anomalies and outliers using advanced statistical methods.',
    category: 'Analytics',
    status: 'beta',
    details: 'Multi-method outlier detection using IQR, Z-score, isolation forest, and local outlier factor algorithms. Provides detailed explanations for why data points are considered outliers.'
  }
];

export const automationFunctions: FunctionItem[] = [
  {
    id: 'schedule-etl',
    name: 'Schedule ETL Jobs',
    description: 'Set up automated ETL workflows and scheduling for continuous data processing.',
    category: 'Automation',
    status: 'active',
    details: 'Intelligent ETL job scheduling system that analyzes your data patterns and suggests optimal processing schedules. Includes monitoring, alerting, and automatic retry mechanisms.'
  },
  {
    id: 'alert-system',
    name: 'Data Quality Alerts',
    description: 'Configure intelligent alerts for data quality issues and anomalies.',
    category: 'Automation',
    status: 'beta',
    details: 'Smart alerting system that monitors data quality metrics, detects anomalies, and sends notifications. Configurable thresholds and machine learning-based anomaly detection.'
  },
  {
    id: 'backup-restore',
    name: 'Backup & Restore',
    description: 'Automated backup and restore strategies for your critical data assets.',
    category: 'Automation',
    status: 'maintenance',
    details: 'Comprehensive backup and restore system with incremental backups, point-in-time recovery, and automated testing of backup integrity. Supports multiple storage backends.'
  }
];

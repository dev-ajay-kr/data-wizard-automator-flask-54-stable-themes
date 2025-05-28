
import { FunctionItem } from './types';

export const etlFunctions: FunctionItem[] = [
  {
    id: 'data-cleansing',
    name: 'Data Cleansing',
    description: 'Remove duplicates, handle missing values, and standardize formats',
    category: 'ETL',
    status: 'active',
    details: 'Analyzes your uploaded data for quality issues including duplicates, missing values, inconsistent formats, and outliers. Provides specific recommendations with counts and percentages.'
  },
  {
    id: 'data-transformation',
    name: 'Data Transformation',
    description: 'Apply business rules and transform data structures',
    category: 'ETL',
    status: 'active',
    details: 'Suggests data transformations to improve structure and usability. Includes normalization opportunities, data type conversions, and business rule applications.'
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Validate data quality and integrity',
    category: 'Quality',
    status: 'active',
    details: 'Validates data integrity, checks for business rule violations, and assesses overall data quality with validation scores and specific issues.'
  }
];

export const analyticsFunctions: FunctionItem[] = [
  {
    id: 'statistical-analysis',
    name: 'Statistical Analysis',
    description: 'Generate descriptive statistics and distributions',
    category: 'Analytics',
    status: 'active',
    details: 'Performs comprehensive statistical analysis including descriptive statistics, distributions, correlations, and significance tests with numerical results and interpretations.'
  },
  {
    id: 'correlation-analysis',
    name: 'Correlation Analysis',
    description: 'Identify relationships between variables',
    category: 'Analytics',
    status: 'active',
    details: 'Analyzes correlations between variables, identifies strong relationships, and provides insights about dependencies in your data.'
  },
  {
    id: 'outlier-detection',
    name: 'Outlier Detection',
    description: 'Detect anomalies and outliers in data',
    category: 'Analytics',
    status: 'beta',
    details: 'Detects outliers and anomalies using statistical methods. Identifies specific records and explains why they are considered outliers.'
  }
];

export const automationFunctions: FunctionItem[] = [
  {
    id: 'schedule-etl',
    name: 'Schedule ETL Jobs',
    description: 'Set up automated data processing pipelines',
    category: 'Automation',
    status: 'active',
    details: 'Suggests useful ETL job schedules based on data characteristics to enhance data quality and provide value with specific job types and frequencies.'
  },
  {
    id: 'alert-system',
    name: 'Alert System',
    description: 'Configure alerts for data quality issues',
    category: 'Automation',
    status: 'active',
    details: 'Recommends alert configurations for data quality monitoring based on observed data patterns, including thresholds and trigger conditions.'
  },
  {
    id: 'backup-restore',
    name: 'Backup & Restore',
    description: 'Automated backup and restore procedures',
    category: 'Automation',
    status: 'maintenance',
    details: 'Suggests backup and restore strategies appropriate for data type and volume, including best practices and scheduling recommendations.'
  }
];


import { ErrorHandler } from './errorHandling';

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
  unique: boolean;
}

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export class DataProcessor {
  static analyzeStructure(data: any[]): DataColumn[] {
    if (!data || data.length === 0) return [];

    const columns: DataColumn[] = [];
    const sampleSize = Math.min(100, data.length);
    const sample = data.slice(0, sampleSize);

    // Get all unique column names
    const columnNames = new Set<string>();
    sample.forEach(row => {
      if (row && typeof row === 'object') {
        Object.keys(row).forEach(key => columnNames.add(key));
      }
    });

    columnNames.forEach(columnName => {
      const values = sample
        .map(row => row?.[columnName])
        .filter(val => val !== null && val !== undefined && val !== '');

      const column: DataColumn = {
        name: columnName,
        type: this.inferDataType(values),
        nullable: values.length < sample.length,
        unique: new Set(values).size === values.length
      };

      columns.push(column);
    });

    return columns;
  }

  static inferDataType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
    if (values.length === 0) return 'string';

    const numericCount = values.filter(val => !isNaN(Number(val))).length;
    const dateCount = values.filter(val => !isNaN(Date.parse(val))).length;
    const booleanCount = values.filter(val => 
      typeof val === 'boolean' || 
      (typeof val === 'string' && ['true', 'false', '1', '0', 'yes', 'no'].includes(val.toLowerCase()))
    ).length;

    const total = values.length;
    const threshold = 0.8;

    if (booleanCount > total * threshold) return 'boolean';
    if (numericCount > total * threshold) return 'number';
    if (dateCount > total * threshold) return 'date';
    return 'string';
  }

  static validateData(data: any[], schema?: DataColumn[]): DataValidationResult {
    const result: DataValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!data || data.length === 0) {
      result.isValid = false;
      result.errors.push('Dataset is empty');
      return result;
    }

    // Check for consistent structure
    const firstRowKeys = Object.keys(data[0] || {});
    const inconsistentRows = data.filter((row, index) => {
      const currentKeys = Object.keys(row || {});
      return JSON.stringify(currentKeys.sort()) !== JSON.stringify(firstRowKeys.sort());
    });

    if (inconsistentRows.length > 0) {
      result.warnings.push(`${inconsistentRows.length} rows have inconsistent structure`);
    }

    // Schema validation if provided
    if (schema) {
      schema.forEach(column => {
        const columnValues = data.map(row => row?.[column.name]);
        const nullCount = columnValues.filter(val => val === null || val === undefined || val === '').length;
        
        if (!column.nullable && nullCount > 0) {
          result.errors.push(`Column '${column.name}' has ${nullCount} null values but is marked as non-nullable`);
          result.isValid = false;
        }

        if (column.unique) {
          const uniqueValues = new Set(columnValues.filter(val => val !== null && val !== undefined && val !== ''));
          if (uniqueValues.size !== columnValues.length - nullCount) {
            result.errors.push(`Column '${column.name}' should have unique values but contains duplicates`);
            result.isValid = false;
          }
        }
      });
    }

    // Generate suggestions
    if (data.length > 10000) {
      result.suggestions.push('Consider using data pagination or chunking for better performance');
    }

    const duplicateRows = this.findDuplicateRows(data);
    if (duplicateRows.length > 0) {
      result.suggestions.push(`Found ${duplicateRows.length} potential duplicate rows`);
    }

    return result;
  }

  static findDuplicateRows(data: any[]): number[] {
    const seen = new Set<string>();
    const duplicates: number[] = [];

    data.forEach((row, index) => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        duplicates.push(index);
      } else {
        seen.add(rowString);
      }
    });

    return duplicates;
  }

  static cleanData(data: any[], options: {
    removeDuplicates?: boolean;
    trimStrings?: boolean;
    handleNulls?: 'remove' | 'replace' | 'keep';
    nullReplacement?: any;
  } = {}): any[] {
    let cleaned = [...data];

    // Trim strings
    if (options.trimStrings) {
      cleaned = cleaned.map(row => {
        const trimmedRow = { ...row };
        Object.keys(trimmedRow).forEach(key => {
          if (typeof trimmedRow[key] === 'string') {
            trimmedRow[key] = trimmedRow[key].trim();
          }
        });
        return trimmedRow;
      });
    }

    // Handle nulls
    if (options.handleNulls === 'remove') {
      cleaned = cleaned.filter(row => 
        Object.values(row).some(val => val !== null && val !== undefined && val !== '')
      );
    } else if (options.handleNulls === 'replace') {
      cleaned = cleaned.map(row => {
        const cleanedRow = { ...row };
        Object.keys(cleanedRow).forEach(key => {
          if (cleanedRow[key] === null || cleanedRow[key] === undefined || cleanedRow[key] === '') {
            cleanedRow[key] = options.nullReplacement || '';
          }
        });
        return cleanedRow;
      });
    }

    // Remove duplicates
    if (options.removeDuplicates) {
      const seen = new Set<string>();
      cleaned = cleaned.filter(row => {
        const rowString = JSON.stringify(row);
        if (seen.has(rowString)) {
          return false;
        }
        seen.add(rowString);
        return true;
      });
    }

    return cleaned;
  }

  static aggregateData(data: any[], groupBy: string, aggregations: Record<string, 'sum' | 'avg' | 'count' | 'min' | 'max'>): any[] {
    try {
      const groups = new Map<string, any[]>();
      
      // Group data
      data.forEach(row => {
        const groupKey = row[groupBy];
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(row);
      });

      // Calculate aggregations
      const result: any[] = [];
      groups.forEach((groupData, groupKey) => {
        const aggregatedRow: any = { [groupBy]: groupKey };
        
        Object.entries(aggregations).forEach(([column, operation]) => {
          const values = groupData
            .map(row => row[column])
            .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
            .map(val => Number(val));

          switch (operation) {
            case 'sum':
              aggregatedRow[`${column}_sum`] = values.reduce((a, b) => a + b, 0);
              break;
            case 'avg':
              aggregatedRow[`${column}_avg`] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
              break;
            case 'count':
              aggregatedRow[`${column}_count`] = values.length;
              break;
            case 'min':
              aggregatedRow[`${column}_min`] = values.length > 0 ? Math.min(...values) : null;
              break;
            case 'max':
              aggregatedRow[`${column}_max`] = values.length > 0 ? Math.max(...values) : null;
              break;
          }
        });

        result.push(aggregatedRow);
      });

      return result;
    } catch (error) {
      console.error('Error aggregating data:', error);
      return [];
    }
  }
}

export const processFileDataForAnalysis = (files: any[]): string => {
  if (!files || files.length === 0) {
    return 'No data files available for analysis.';
  }

  try {
    return files.map(file => {
      const basicInfo = `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes`;
      
      if (file.parsedData && Array.isArray(file.parsedData) && file.parsedData.length > 0) {
        const structure = DataProcessor.analyzeStructure(file.parsedData);
        const validation = DataProcessor.validateData(file.parsedData, structure);
        
        const structureInfo = structure.map(col => 
          `${col.name}: ${col.type}${col.nullable ? ' (nullable)' : ''}${col.unique ? ' (unique)' : ''}`
        ).join(', ');

        const validationInfo = [
          `Validation: ${validation.isValid ? 'PASSED' : 'FAILED'}`,
          validation.errors.length > 0 ? `Errors: ${validation.errors.join('; ')}` : '',
          validation.warnings.length > 0 ? `Warnings: ${validation.warnings.join('; ')}` : '',
          validation.suggestions.length > 0 ? `Suggestions: ${validation.suggestions.join('; ')}` : ''
        ].filter(Boolean).join('\n');

        const sampleData = file.parsedData.slice(0, 5);
        
        return [
          basicInfo,
          `Rows: ${file.parsedData.length}`,
          `Structure: [${structureInfo}]`,
          validationInfo,
          `Sample Data (first 5 rows):`,
          JSON.stringify(sampleData, null, 2)
        ].join('\n');
      }
      
      return `${basicInfo}\nStatus: File uploaded but not processed yet`;
    }).join('\n\n---\n\n');
  } catch (error) {
    console.error('Error processing file data:', error);
    return 'Error processing file data for analysis.';
  }
};

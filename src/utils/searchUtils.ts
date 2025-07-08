
export interface SearchFilter {
  column: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greater' | 'less' | 'between' | 'in';
  value: any;
  secondValue?: any; // For 'between' operator
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export class SearchEngine {
  static search(data: any[], query: string, searchColumns?: string[]): any[] {
    if (!query.trim()) return data;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return data.filter(row => {
      const columnsToSearch = searchColumns || Object.keys(row);
      
      return searchTerms.every(term => {
        return columnsToSearch.some(column => {
          const value = String(row[column] || '').toLowerCase();
          return value.includes(term);
        });
      });
    });
  }

  static filter(data: any[], filters: SearchFilter[]): any[] {
    if (!filters || filters.length === 0) return data;

    return data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.column];
        
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
            
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
            
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
            
          case 'greater':
            return Number(value) > Number(filter.value);
            
          case 'less':
            return Number(value) < Number(filter.value);
            
          case 'between':
            const numValue = Number(value);
            return numValue >= Number(filter.value) && numValue <= Number(filter.secondValue);
            
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
            
          default:
            return true;
        }
      });
    });
  }

  static sort(data: any[], sortConfig: SortConfig): any[] {
    if (!sortConfig.column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Numeric comparison
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        const diff = Number(aValue) - Number(bValue);
        return sortConfig.direction === 'asc' ? diff : -diff;
      }

      // Date comparison
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        const diff = aDate.getTime() - bDate.getTime();
        return sortConfig.direction === 'asc' ? diff : -diff;
      }

      // String comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      const diff = aString.localeCompare(bString);
      return sortConfig.direction === 'asc' ? diff : -diff;
    });
  }

  static paginate<T>(data: T[], page: number, pageSize: number): { data: T[]; totalPages: number; currentPage: number; totalItems: number } {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / pageSize),
      currentPage: page,
      totalItems: data.length
    };
  }

  static getUniqueValues(data: any[], column: string): any[] {
    const values = data.map(row => row[column]);
    return Array.from(new Set(values)).filter(val => val !== null && val !== undefined);
  }

  static buildSearchIndex(data: any[], columns: string[]): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();

    data.forEach((row, rowIndex) => {
      columns.forEach(column => {
        const value = String(row[column] || '').toLowerCase();
        const words = value.split(/\s+/).filter(word => word.length > 0);
        
        words.forEach(word => {
          if (!index.has(word)) {
            index.set(word, new Set());
          }
          index.get(word)!.add(rowIndex);
        });
      });
    });

    return index;
  }

  static searchWithIndex(data: any[], query: string, searchIndex: Map<string, Set<number>>): any[] {
    if (!query.trim()) return data;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    if (searchTerms.length === 0) return data;

    // Get row indices that contain all search terms
    let matchingIndices: Set<number> | null = null;

    searchTerms.forEach(term => {
      const termMatches = new Set<number>();
      
      // Find all index entries that contain the term
      searchIndex.forEach((rowIndices, indexedTerm) => {
        if (indexedTerm.includes(term)) {
          rowIndices.forEach(index => termMatches.add(index));
        }
      });

      if (matchingIndices === null) {
        matchingIndices = termMatches;
      } else {
        // Intersection of previous matches and current term matches
        matchingIndices = new Set([...matchingIndices].filter(index => termMatches.has(index)));
      }
    });

    if (!matchingIndices || matchingIndices.size === 0) return [];

    return Array.from(matchingIndices).map(index => data[index]);
  }

  static generateFilterSuggestions(data: any[], column: string): SearchFilter[] {
    const suggestions: SearchFilter[] = [];
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
    
    if (values.length === 0) return suggestions;

    const uniqueValues = Array.from(new Set(values));
    
    // For columns with few unique values, suggest equality filters
    if (uniqueValues.length <= 10) {
      uniqueValues.slice(0, 5).forEach(value => {
        suggestions.push({
          column,
          operator: 'equals',
          value
        });
      });
    }

    // For numeric columns, suggest range filters
    const numericValues = values.filter(val => !isNaN(Number(val))).map(val => Number(val));
    if (numericValues.length > 0) {
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      
      suggestions.push({
        column,
        operator: 'greater',
        value: avg
      });
      
      suggestions.push({
        column,
        operator: 'between',
        value: min,
        secondValue: max
      });
    }

    return suggestions;
  }
}

export const createAdvancedSearchHook = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ column: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const processData = React.useCallback((data: any[]) => {
    let processed = data;

    // Apply search
    if (searchQuery) {
      processed = SearchEngine.search(processed, searchQuery);
    }

    // Apply filters
    if (filters.length > 0) {
      processed = SearchEngine.filter(processed, filters);
    }

    // Apply sorting
    if (sortConfig.column) {
      processed = SearchEngine.sort(processed, sortConfig);
    }

    // Apply pagination
    const paginated = SearchEngine.paginate(processed, currentPage, pageSize);

    return {
      data: paginated.data,
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage
    };
  }, [searchQuery, filters, sortConfig, currentPage, pageSize]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    processData
  };
};

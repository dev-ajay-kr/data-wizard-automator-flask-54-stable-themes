
export interface FunctionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'maintenance';
  details: string;
}

export interface FunctionResult {
  title: string;
  summary: string;
  details: string;
  timestamp: string;
  functionId: string;
  exportable: boolean;
  error?: boolean;
}

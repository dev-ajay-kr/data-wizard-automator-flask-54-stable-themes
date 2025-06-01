
export interface FunctionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'maintenance';
  details: string;
  prompt: string;
}

export interface FunctionResult {
  id: string;
  title: string;
  summary: string;
  details: string;
  timestamp: string;
  exportable: boolean;
  error?: boolean;
}

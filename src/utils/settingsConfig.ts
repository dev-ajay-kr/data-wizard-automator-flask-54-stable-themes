
export interface AppSettings {
  theme: string;
  apiKeys: ApiKeyConfig[];
  dataPreferences: DataPreferences;
  uiPreferences: UIPreferences;
  exportSettings: ExportSettings;
  performance: PerformanceSettings;
}

export interface ApiKeyConfig {
  id: string;
  provider: 'Gemini' | 'OpenAI' | 'Custom';
  key: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

export interface DataPreferences {
  defaultChartType: 'bar' | 'line' | 'pie' | 'scatter';
  maxRowsToProcess: number;
  autoDetectDataTypes: boolean;
  showDataValidation: boolean;
  enableDataCaching: boolean;
  defaultAggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface UIPreferences {
  showQuickPrompts: boolean;
  enableAnimations: boolean;
  compactMode: boolean;
  defaultPageSize: number;
  showLineNumbers: boolean;
  enableDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface ExportSettings {
  defaultFormat: 'xlsx' | 'csv' | 'json' | 'png' | 'pdf';
  includeMetadata: boolean;
  compression: boolean;
  watermark: boolean;
  customWatermarkText?: string;
}

export interface PerformanceSettings {
  enableLogging: boolean;
  enableMetrics: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number;
  retryAttempts: number;
  cacheExpiration: number;
}

export class SettingsManager {
  private static readonly STORAGE_KEY = 'etlhub_settings';
  private static readonly DEFAULT_SETTINGS: AppSettings = {
    theme: 'classic',
    apiKeys: [],
    dataPreferences: {
      defaultChartType: 'bar',
      maxRowsToProcess: 10000,
      autoDetectDataTypes: true,
      showDataValidation: true,
      enableDataCaching: true,
      defaultAggregation: 'sum'
    },
    uiPreferences: {
      showQuickPrompts: true,
      enableAnimations: true,
      compactMode: false,
      defaultPageSize: 10,
      showLineNumbers: true,
      enableDarkMode: false,
      fontSize: 'medium'
    },
    exportSettings: {
      defaultFormat: 'xlsx',
      includeMetadata: true,
      compression: false,
      watermark: false
    },
    performance: {
      enableLogging: true,
      enableMetrics: true,
      maxConcurrentRequests: 3,
      requestTimeout: 30000,
      retryAttempts: 3,
      cacheExpiration: 3600000
    }
  };

  static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return this.DEFAULT_SETTINGS;
  }

  static saveSettings(settings: Partial<AppSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  static resetSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }

  static updateApiKeys(apiKeys: ApiKeyConfig[]): void {
    this.saveSettings({ apiKeys });
  }

  static getApiKey(provider: string): ApiKeyConfig | null {
    const settings = this.getSettings();
    return settings.apiKeys.find(key => key.provider === provider && key.isActive) || null;
  }

  static getDefaultApiKey(): ApiKeyConfig | null {
    const settings = this.getSettings();
    return settings.apiKeys.find(key => key.isDefault && key.isActive) || null;
  }

  static validateSettings(settings: Partial<AppSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.dataPreferences) {
      const { maxRowsToProcess } = settings.dataPreferences;
      if (maxRowsToProcess !== undefined && (maxRowsToProcess < 100 || maxRowsToProcess > 100000)) {
        errors.push('Max rows to process must be between 100 and 100,000');
      }
    }

    if (settings.performance) {
      const { maxConcurrentRequests, requestTimeout, retryAttempts } = settings.performance;
      
      if (maxConcurrentRequests !== undefined && (maxConcurrentRequests < 1 || maxConcurrentRequests > 10)) {
        errors.push('Max concurrent requests must be between 1 and 10');
      }
      
      if (requestTimeout !== undefined && (requestTimeout < 5000 || requestTimeout > 120000)) {
        errors.push('Request timeout must be between 5 and 120 seconds');
      }
      
      if (retryAttempts !== undefined && (retryAttempts < 0 || retryAttempts > 5)) {
        errors.push('Retry attempts must be between 0 and 5');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static exportSettings(): string {
    const settings = this.getSettings();
    // Remove sensitive data like API keys
    const exportData = {
      ...settings,
      apiKeys: settings.apiKeys.map(key => ({
        ...key,
        key: '***REDACTED***'
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  static importSettings(settingsJson: string): { success: boolean; errors: string[] } {
    try {
      const importedSettings = JSON.parse(settingsJson);
      const validation = this.validateSettings(importedSettings);
      
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Don't import API keys for security
      const { apiKeys, ...safeSettings } = importedSettings;
      this.saveSettings(safeSettings);
      
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: ['Invalid settings format'] };
    }
  }

  static migrateSettings(): void {
    // Handle migration from old settings format
    try {
      const legacyApiKey = localStorage.getItem('gemini_api_key');
      const legacyTheme = localStorage.getItem('currentTheme');
      
      if (legacyApiKey || legacyTheme) {
        const settings = this.getSettings();
        
        if (legacyApiKey && !settings.apiKeys.some(key => key.provider === 'Gemini')) {
          settings.apiKeys.push({
            id: 'legacy-gemini',
            provider: 'Gemini',
            key: legacyApiKey,
            name: 'Legacy Gemini Key',
            isDefault: true,
            isActive: true,
            createdAt: new Date()
          });
        }
        
        if (legacyTheme) {
          settings.theme = legacyTheme;
        }
        
        this.saveSettings(settings);
        
        // Clean up legacy keys
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('currentTheme');
      }
    } catch (error) {
      console.warn('Settings migration failed:', error);
    }
  }
}

// Initialize settings migration on module load
SettingsManager.migrateSettings();

export default SettingsManager;

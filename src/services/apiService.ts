
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

interface GeminiRequest {
  prompt: string;
  context?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

class ApiService {
  private getGeminiApiKey(): string {
    // Check for API key from multiple sources
    const savedKeys = localStorage.getItem('api_keys');
    let apiKey = localStorage.getItem('gemini_api_key');
    
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      const geminiKey = keys.find((k: any) => k.provider === 'Gemini' && k.isDefault);
      if (geminiKey) {
        apiKey = geminiKey.key;
      }
    }
    
    // Fallback to default key
    if (!apiKey) {
      apiKey = 'AIzaSyBgmj8RqYeGfarD8WHQkegvXnxGLd7Z5x8';
      localStorage.setItem('gemini_api_key', apiKey);
    }
    
    return apiKey;
  }

  async callGemini(request: GeminiRequest): Promise<ApiResponse<string>> {
    try {
      const {
        prompt,
        context,
        model = 'gemini-1.5-flash',
        temperature = 0.7,
        maxTokens = 2048
      } = request;

      const apiKey = this.getGeminiApiKey();
      const fullPrompt = context 
        ? `${prompt}\n\nData Context:\n${context}\n\nPlease provide a structured response with actionable insights.`
        : prompt;

      console.log('🔄 API Service: Making Gemini request', {
        model,
        promptLength: fullPrompt.length,
        hasContext: !!context
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!text) {
        throw new Error('Empty response from API');
      }

      return {
        data: text,
        success: true
      };
    } catch (error: any) {
      console.error('❌ API Service Error:', error);
      return {
        error: error.message || 'API request failed',
        success: false
      };
    }
  }

  // Utility method for retrying failed requests
  async retryRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        if (result.success) {
          return result;
        }
        lastError = result.error || 'Unknown error';
      } catch (error: any) {
        lastError = error.message || 'Request failed';
      }
      
      if (attempt < maxRetries) {
        console.log(`🔄 Retrying request (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    return {
      error: `Failed after ${maxRetries} attempts: ${lastError}`,
      success: false
    };
  }
}

export const apiService = new ApiService();

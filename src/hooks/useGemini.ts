
import { useState } from 'react';

interface GeminiResponse {
  text: string;
  error?: string;
}

interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callGemini = async (
    prompt: string, 
    context?: string, 
    config: GeminiConfig = {}
  ): Promise<GeminiResponse> => {
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
    
    // Fallback to default key if none found
    if (!apiKey) {
      apiKey = 'AIzaSyBgmj8RqYeGfarD8WHQkegvXnxGLd7Z5x8';
      localStorage.setItem('gemini_api_key', apiKey);
    }

    setIsLoading(true);
    
    try {
      const {
        model = 'gemini-1.5-flash',
        temperature = 0.7,
        maxTokens = 2048
      } = config;

      const fullPrompt = context 
        ? `${prompt}\n\nData Context:\n${context}\n\nPlease provide a structured response with actionable insights.`
        : prompt;

      console.log('🤖 Making Gemini API call:', {
        model,
        promptLength: fullPrompt.length,
        temperature,
        maxTokens
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
        console.error('🚨 Gemini API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Gemini API Response received successfully');
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      return { text };
    } catch (error: any) {
      console.error('❌ Gemini API call failed:', error);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to connect to Gemini AI. ';
      
      if (error.message.includes('overloaded')) {
        userMessage += 'The service is currently busy. Please try again in a moment.';
      } else if (error.message.includes('API_KEY')) {
        userMessage += 'Please check your API key configuration.';
      } else if (error.message.includes('QUOTA')) {
        userMessage += 'API quota exceeded. Please check your usage limits.';
      } else {
        userMessage += error.message || 'Unknown error occurred';
      }
      
      return { 
        text: '', 
        error: userMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { callGemini, isLoading };
};

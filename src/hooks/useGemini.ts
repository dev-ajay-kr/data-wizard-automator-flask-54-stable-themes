
import { useState } from 'react';

interface GeminiResponse {
  text: string;
  error?: string;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callGemini = async (prompt: string, context?: string): Promise<GeminiResponse> => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set it in the chat interface first.');
    }

    setIsLoading(true);
    
    try {
      const fullPrompt = context 
        ? `${prompt}\n\nData Context:\n${context}\n\nPlease provide a structured response with actionable insights.`
        : prompt;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return { text };
    } catch (error: any) {
      console.error('Gemini API call failed:', error);
      return { 
        text: '', 
        error: error.message || 'Unknown error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { callGemini, isLoading };
};

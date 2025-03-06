
// This service connects to OpenAI's API to generate real AI market analysis

import { toast } from "sonner";
import { getOpenAIApiKey } from "../config/apiKeys";
import { fetchStockNews } from "./stockService";

// OpenAI API types
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

export const getMarketAnalysis = async () => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error("OpenAI API key not set. Please set your API key first.");
  }

  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial analyst. Provide a detailed market analysis in JSON format. The response should include these fields only: summary (string), trend (string, must be either "bearish", "bullish", or "neutral"), confidence (number between 45-85), noteworthy (array of stock movements with fields: symbol, change (number), reason (string), type ("surge" or "drop")), factors (array of strings describing market factors), and updatedAt (current date ISO string).'
          },
          {
            role: 'user',
            content: 'Generate a comprehensive market analysis for today. Include the required fields in your JSON response.'
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as OpenAIResponse;
    
    // Parse the AI's response (assuming it returns valid JSON)
    try {
      const jsonResponse = JSON.parse(data.choices[0].message.content.trim());
      
      // Ensure we have all required fields and proper formatting
      return {
        summary: jsonResponse.summary || "No summary provided",
        trend: ['bearish', 'bullish', 'neutral'].includes(jsonResponse.trend) 
          ? jsonResponse.trend 
          : 'neutral',
        confidence: typeof jsonResponse.confidence === 'number' 
          ? Math.min(Math.max(jsonResponse.confidence, 45), 85) 
          : 70,
        noteworthy: Array.isArray(jsonResponse.noteworthy) 
          ? jsonResponse.noteworthy.map((stock: any) => ({
              symbol: stock.symbol || 'UNKNOWN',
              change: typeof stock.change === 'number' ? stock.change : 0,
              reason: stock.reason || 'No reason provided',
              type: stock.type === 'surge' || stock.type === 'drop' ? stock.type : 'surge'
            }))
          : [],
        factors: Array.isArray(jsonResponse.factors) 
          ? jsonResponse.factors 
          : ["No market factors provided"],
        updatedAt: jsonResponse.updatedAt || new Date().toISOString()
      };
    } catch (parseError) {
      console.error("Failed to parse OpenAI's response as JSON:", parseError);
      throw new Error("Failed to parse AI's response. Please try again.");
    }
  } catch (error) {
    console.error("Error in getMarketAnalysis:", error);
    throw error;
  }
};

export type StockRecommendation = {
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  timeHorizon: 'short-term' | 'medium-term' | 'long-term';
};

export const getStockRecommendation = async (symbol: string): Promise<StockRecommendation> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error("OpenAI API key not set. Please set your API key first.");
  }

  try {
    // Fetch news related to this stock for better analysis
    const stockNews = await fetchStockNews(symbol);
    const newsContext = stockNews.length > 0 
      ? `Recent news about ${symbol}: ${stockNews.slice(0, 5).map((item: any) => `"${item.title}"`).join('. ')}`
      : `Analyze the stock ${symbol} with the information you have.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert stock analyst. Provide investment advice for a specific stock in JSON format. The response should include these fields only: recommendation (string, must be either "buy", "sell", or "hold"), confidence (number between 55-85), reasoning (string explaining the recommendation in detail with market analysis and supporting facts), and timeHorizon (string, must be either "short-term", "medium-term", or "long-term").`
          },
          {
            role: 'user',
            content: newsContext
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as OpenAIResponse;
    
    // Parse the AI's response
    try {
      // Try to extract JSON from the response
      const content = data.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      let jsonResponse;
      
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in the response");
      }
      
      // Validate and return the response
      const recommendation = ['buy', 'sell', 'hold'].includes(jsonResponse.recommendation) 
        ? jsonResponse.recommendation 
        : 'hold';
        
      const confidence = typeof jsonResponse.confidence === 'number' 
        ? Math.min(Math.max(jsonResponse.confidence, 55), 85) 
        : 70;
        
      const timeHorizon = ['short-term', 'medium-term', 'long-term'].includes(jsonResponse.timeHorizon) 
        ? jsonResponse.timeHorizon 
        : 'medium-term';
        
      return {
        recommendation,
        confidence,
        reasoning: jsonResponse.reasoning || "No reasoning provided",
        timeHorizon
      };
    } catch (parseError) {
      console.error("Failed to parse OpenAI's response as JSON:", parseError);
      console.log("Raw response:", data.choices[0].message.content);
      throw new Error("Failed to parse AI's response. Please try again.");
    }
  } catch (error) {
    console.error("Error in getStockRecommendation:", error);
    throw error;
  }
};


// Enhanced news API service that fetches from Alpha Vantage and uses OpenAI for ranking

import { getAlphaVantageApiKey, getOpenAIApiKey } from '../config/apiKeys';
import { toast } from 'sonner';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  importance?: number; // Added for OpenAI ranking
}

// Fetches news from Alpha Vantage API and ranks them with OpenAI
export const fetchNews = async (): Promise<NewsItem[]> => {
  const alphaVantageKey = getAlphaVantageApiKey();
  
  if (!alphaVantageKey) {
    console.warn('Alpha Vantage API key not set, using mock data');
    return getMockNews();
  }
  
  try {
    // Fetch news from Alpha Vantage
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${alphaVantageKey}&limit=50`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data from Alpha Vantage');
    }
    
    const data = await response.json();
    
    if (!data.feed || !Array.isArray(data.feed)) {
      throw new Error('Invalid news data format from Alpha Vantage');
    }
    
    // Map the API response to our NewsItem interface
    let newsItems: NewsItem[] = data.feed.map((item: any, index: number) => {
      // Determine sentiment based on sentiment score if available
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (item.overall_sentiment_score) {
        sentiment = parseFloat(item.overall_sentiment_score) > 0.2 
          ? 'positive' 
          : parseFloat(item.overall_sentiment_score) < -0.2 
            ? 'negative' 
            : 'neutral';
      }
      
      // Determine category based on topics
      let category = 'Markets';
      if (item.topics && item.topics.length > 0) {
        const topics = item.topics.map((t: any) => t.topic);
        if (topics.includes('technology')) category = 'Technology';
        else if (topics.includes('energy')) category = 'Energy';
        else if (topics.some((t: string) => t.includes('health'))) category = 'Healthcare';
        else if (topics.some((t: string) => t.includes('econom'))) category = 'Economy';
        else if (topics.some((t: string) => t.includes('retail'))) category = 'Retail';
      }
      
      return {
        id: `news-${index}-${Date.now()}`,
        title: item.title,
        description: item.summary || "No description available",
        source: item.source || "Financial News",
        url: item.url,
        publishedAt: item.time_published || new Date().toISOString(),
        sentiment,
        category
      };
    });
    
    // If OpenAI API key is set, use it to rank the news
    const openAIKey = getOpenAIApiKey();
    if (openAIKey && newsItems.length > 0) {
      try {
        newsItems = await rankNewsWithOpenAI(newsItems, openAIKey);
      } catch (openAIError) {
        console.error('Error ranking news with OpenAI:', openAIError);
        // Continue with unranked news
      }
    }
    
    return newsItems.slice(0, 20); // Return top 20 news items
  } catch (error) {
    console.error('Error fetching news from Alpha Vantage:', error);
    return getMockNews();
  }
};

// Use OpenAI to rank news by importance
async function rankNewsWithOpenAI(newsItems: NewsItem[], apiKey: string): Promise<NewsItem[]> {
  try {
    // Create concise representation of news items for the API call
    const newsData = newsItems.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.description
    }));
    
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
            content: 'You are a financial news analyst. Analyze the following financial news items and rank them by importance for market investors. Return a JSON array with item IDs and importance scores from 1-100, where 100 is most important.'
          },
          {
            role: 'user',
            content: JSON.stringify(newsData)
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the OpenAI response to get rankings
    let rankings;
    try {
      // Extract the JSON part from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        rankings = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      console.log("Raw response:", content);
      throw new Error("Failed to parse rankings");
    }
    
    // Map importance scores to original news items
    const rankedNews = [...newsItems];
    rankings.forEach((rank: { id: string, importance: number }) => {
      const index = rankedNews.findIndex(item => item.id === rank.id);
      if (index !== -1) {
        rankedNews[index].importance = rank.importance;
      }
    });
    
    // Sort by importance (highest first)
    return rankedNews
      .sort((a, b) => (b.importance || 0) - (a.importance || 0));
      
  } catch (error) {
    console.error('Failed to rank news with OpenAI:', error);
    toast.error('Failed to rank news with AI. Showing unranked results.');
    return newsItems;
  }
}

// Mock news data generator - used as fallback when APIs fail
const getMockNews = (): NewsItem[] => {
  return [
    {
      id: '1',
      title: 'Fed Signals Potential Rate Cut in September',
      description: 'Federal Reserve Chairman Jerome Powell hinted at a potential interest rate cut in September, citing improving inflation data and concerns about the labor market.',
      source: 'Financial Times',
      url: 'https://example.com/news/1',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sentiment: 'positive',
      category: 'Economy'
    },
    {
      id: '2',
      title: 'Tech Stocks Slide as Semiconductor Shortage Continues',
      description: 'Major tech companies experienced a significant drop in stock prices as the global semiconductor shortage shows no signs of easing, impacting production capabilities.',
      source: 'Wall Street Journal',
      url: 'https://example.com/news/2',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      sentiment: 'negative',
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Oil Prices Surge Amid Middle East Tensions',
      description: 'Crude oil prices jumped more than 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.',
      source: 'Reuters',
      url: 'https://example.com/news/3',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
      sentiment: 'negative',
      category: 'Energy'
    },
    {
      id: '4',
      title: 'Amazon Announces Record Prime Day Sales',
      description: 'E-commerce giant Amazon reported its most successful Prime Day event ever, with sales surpassing $12 billion globally over the two-day period.',
      source: 'Bloomberg',
      url: 'https://example.com/news/4',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      sentiment: 'positive',
      category: 'Retail'
    },
    {
      id: '5',
      title: 'Inflation Data Shows Signs of Cooling',
      description: 'The latest Consumer Price Index report indicates inflation may be slowing, with the core inflation rate coming in below economists\' expectations.',
      source: 'CNBC',
      url: 'https://example.com/news/5',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      sentiment: 'positive',
      category: 'Economy'
    },
    {
      id: '6',
      title: 'Healthcare Stocks Rally Following New Medicare Policy',
      description: 'Shares of major healthcare providers surged after the government announced changes to Medicare reimbursement policies that are expected to boost profits.',
      source: 'MarketWatch',
      url: 'https://example.com/news/6',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      sentiment: 'positive',
      category: 'Healthcare'
    },
    {
      id: '7',
      title: 'European Central Bank Maintains Current Interest Rates',
      description: 'The ECB voted to keep interest rates unchanged at its latest meeting, adopting a wait-and-see approach amid mixed economic signals across the Eurozone.',
      source: 'Economic Times',
      url: 'https://example.com/news/7',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      sentiment: 'neutral',
      category: 'Economy'
    },
    {
      id: '8',
      title: 'Tesla Delivers Record Number of Vehicles in Q2',
      description: 'Electric vehicle manufacturer Tesla announced record-breaking deliveries for the second quarter, exceeding analyst expectations and boosting investor confidence.',
      source: 'Business Insider',
      url: 'https://example.com/news/8',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      sentiment: 'positive',
      category: 'Automotive'
    }
  ];
};

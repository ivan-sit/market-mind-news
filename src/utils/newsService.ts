// Real news API service that fetches from multiple sources

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
}

// Fetches news from Marketaux API (financial news)
export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    // First try with Marketaux API (free tier)
    const response = await fetch(
      'https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT,AAPL,GOOGL&filter_entities=true&language=en&api_token=R2p0n4CRhP71TPLCuShtB5tpL9NfAJ3s2kxKXirg'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data');
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid news data format');
    }
    
    // Map the API response to our NewsItem interface
    const newsItems: NewsItem[] = data.data.map((item: any, index: number) => {
      // Determine sentiment based on sentiment score if available
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (item.sentiment_score) {
        sentiment = item.sentiment_score > 0.2 
          ? 'positive' 
          : item.sentiment_score < -0.2 
            ? 'negative' 
            : 'neutral';
      }
      
      // Determine category based on entity types or keywords
      let category = 'Markets';
      if (item.entities && item.entities.length > 0) {
        const entityTypes = item.entities.map((e: any) => e.type);
        if (entityTypes.includes('technology')) category = 'Technology';
        else if (entityTypes.includes('energy')) category = 'Energy';
        else if (entityTypes.includes('healthcare')) category = 'Healthcare';
        else if (entityTypes.includes('finance')) category = 'Economy';
      }
      
      return {
        id: item.uuid || `news-${index}`,
        title: item.title,
        description: item.description || item.snippet || "No description available",
        source: item.source || "Financial News",
        url: item.url,
        publishedAt: item.published_at,
        sentiment,
        category
      };
    });
    
    return newsItems;
  } catch (error) {
    console.error('Error fetching news from Marketaux:', error);
    
    // Fallback to Finnhub API
    try {
      const response = await fetch(
        'https://finnhub.io/api/v1/news?category=general&token=cjk3e1pr01qj3c1vodhgcjk3e1pr01qj3c1vodi0'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news from fallback source');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid news data format from fallback source');
      }
      
      // Map Finnhub data to our format
      const newsItems: NewsItem[] = data.map((item: any, index: number) => {
        // Simple sentiment analysis based on title
        const title = item.headline.toLowerCase();
        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
        
        const positiveWords = ['rise', 'gain', 'up', 'surge', 'jump', 'positive', 'growth', 'boost'];
        const negativeWords = ['fall', 'drop', 'down', 'decline', 'negative', 'loss', 'cut', 'slash'];
        
        if (positiveWords.some(word => title.includes(word))) {
          sentiment = 'positive';
        } else if (negativeWords.some(word => title.includes(word))) {
          sentiment = 'negative';
        }
        
        // Determine category based on keywords
        let category = 'Markets';
        const categoryKeywords = {
          'Technology': ['tech', 'software', 'hardware', 'apple', 'microsoft', 'google', 'amazon'],
          'Economy': ['economy', 'fed', 'interest rate', 'inflation', 'gdp'],
          'Energy': ['oil', 'gas', 'energy', 'renewable', 'solar', 'wind'],
          'Healthcare': ['health', 'pharma', 'drug', 'medical', 'biotech'],
          'Retail': ['retail', 'consumer', 'shop', 'store', 'brand']
        };
        
        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => title.includes(keyword))) {
            category = cat;
            break;
          }
        }
        
        return {
          id: item.id.toString() || `news-${index}`,
          title: item.headline,
          description: item.summary || "No description available",
          source: item.source,
          url: item.url,
          publishedAt: new Date(item.datetime * 1000).toISOString(),
          sentiment,
          category
        };
      });
      
      return newsItems;
    } catch (fallbackError) {
      console.error('Error fetching news from fallback source:', fallbackError);
      // Fall back to mock data if all APIs fail
      return getMockNews();
    }
  }
};

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

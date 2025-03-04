
// Simulating API call - In a real app, this would fetch from a real API
export const fetchNews = async () => {
  // We're simulating an API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock news data
  return [
    {
      id: '1',
      title: 'Fed Signals Potential Rate Cut in September',
      description: 'Federal Reserve Chairman Jerome Powell hinted at a potential interest rate cut in September, citing improving inflation data and concerns about the labor market.',
      source: 'Financial Times',
      url: 'https://example.com/news/1',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sentiment: 'positive' as const,
      category: 'Economy'
    },
    {
      id: '2',
      title: 'Tech Stocks Slide as Semiconductor Shortage Continues',
      description: 'Major tech companies experienced a significant drop in stock prices as the global semiconductor shortage shows no signs of easing, impacting production capabilities.',
      source: 'Wall Street Journal',
      url: 'https://example.com/news/2',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      sentiment: 'negative' as const,
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Oil Prices Surge Amid Middle East Tensions',
      description: 'Crude oil prices jumped more than 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.',
      source: 'Reuters',
      url: 'https://example.com/news/3',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
      sentiment: 'negative' as const,
      category: 'Energy'
    },
    {
      id: '4',
      title: 'Amazon Announces Record Prime Day Sales',
      description: 'E-commerce giant Amazon reported its most successful Prime Day event ever, with sales surpassing $12 billion globally over the two-day period.',
      source: 'Bloomberg',
      url: 'https://example.com/news/4',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      sentiment: 'positive' as const,
      category: 'Retail'
    },
    {
      id: '5',
      title: 'Inflation Data Shows Signs of Cooling',
      description: 'The latest Consumer Price Index report indicates inflation may be slowing, with the core inflation rate coming in below economists\' expectations.',
      source: 'CNBC',
      url: 'https://example.com/news/5',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      sentiment: 'positive' as const,
      category: 'Economy'
    },
    {
      id: '6',
      title: 'Healthcare Stocks Rally Following New Medicare Policy',
      description: 'Shares of major healthcare providers surged after the government announced changes to Medicare reimbursement policies that are expected to boost profits.',
      source: 'MarketWatch',
      url: 'https://example.com/news/6',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      sentiment: 'positive' as const,
      category: 'Healthcare'
    },
    {
      id: '7',
      title: 'European Central Bank Maintains Current Interest Rates',
      description: 'The ECB voted to keep interest rates unchanged at its latest meeting, adopting a wait-and-see approach amid mixed economic signals across the Eurozone.',
      source: 'Economic Times',
      url: 'https://example.com/news/7',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      sentiment: 'neutral' as const,
      category: 'Economy'
    },
    {
      id: '8',
      title: 'Tesla Delivers Record Number of Vehicles in Q2',
      description: 'Electric vehicle manufacturer Tesla announced record-breaking deliveries for the second quarter, exceeding analyst expectations and boosting investor confidence.',
      source: 'Business Insider',
      url: 'https://example.com/news/8',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      sentiment: 'positive' as const,
      category: 'Automotive'
    }
  ];
};

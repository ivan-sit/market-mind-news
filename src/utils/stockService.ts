
import { getAlphaVantageApiKey } from '../config/apiKeys';

// Alpha Vantage API endpoints
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchPopularStocks = async (): Promise<string[]> => {
  const apiKey = getAlphaVantageApiKey();
  
  if (!apiKey) {
    // Return default popular stocks if no API key is provided
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  }
  
  try {
    // Fetch the list of top gainers/losers from Alpha Vantage
    const response = await fetch(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular stocks');
    }
    
    const data = await response.json();
    
    if (!data.top_gainers || !Array.isArray(data.top_gainers)) {
      throw new Error('Invalid response format');
    }
    
    // Extract symbols from top gainers (limit to 5)
    const symbols = data.top_gainers
      .slice(0, 5)
      .map((stock: any) => stock.ticker);
    
    return symbols;
  } catch (error) {
    console.error('Error fetching popular stocks:', error);
    // Return default popular stocks on error
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  }
};

export const fetchStockData = async (symbol: string) => {
  const apiKey = getAlphaVantageApiKey();
  
  if (!apiKey) {
    // If no API key, use mock data
    return generateMockStockData(symbol);
  }
  
  try {
    // Fetch the current quote for the stock
    const quoteResponse = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
    
    if (!quoteResponse.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
    
    const quoteData = await quoteResponse.json();
    
    // Check if we have a valid quote
    if (!quoteData['Global Quote'] || Object.keys(quoteData['Global Quote']).length === 0) {
      throw new Error(`No quote data found for ${symbol}`);
    }
    
    const quote = quoteData['Global Quote'];
    
    // Fetch the historical data (daily)
    const historyResponse = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
    );
    
    if (!historyResponse.ok) {
      throw new Error(`Failed to fetch history for ${symbol}`);
    }
    
    const historyData = await historyResponse.json();
    
    // Check if we have valid historical data
    if (!historyData['Time Series (Daily)']) {
      throw new Error(`No historical data found for ${symbol}`);
    }
    
    // Process historical data
    const timeSeriesData = historyData['Time Series (Daily)'];
    const historicalData = Object.entries(timeSeriesData)
      .map(([date, values]: [string, any]) => ({
        date,
        close: parseFloat(values['4. close'])
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-31); // Last 31 days
    
    // Calculate price change
    const price = parseFloat(quote['05. price']);
    const prevClose = parseFloat(quote['08. previous close']);
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;
    
    // Combine the data
    return {
      symbol,
      companyName: `${symbol}`, // Alpha Vantage doesn't provide company name in GLOBAL_QUOTE
      price,
      change,
      changePercent,
      historicalData
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    // Fallback to mock data on error
    return generateMockStockData(symbol);
  }
};

// Function to generate mock stock data (used as fallback when API key is not provided or on error)
const generateMockStockData = (symbol: string) => {
  // Generate mock historical data (last 30 days)
  const generateHistoricalData = (basePrice: number) => {
    const data = [];
    const today = new Date();
    let price = basePrice;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Random price movement (more realistic than pure random)
      const change = (Math.random() - 0.5) * (basePrice * 0.02); // Up to 2% movement
      price += change;
      
      // Ensure price doesn't go below a minimum value
      price = Math.max(price, basePrice * 0.7);
      
      data.push({
        date: date.toISOString().split('T')[0],
        close: price
      });
    }
    
    return data;
  };

  // Mapping of stocks to their mock data
  const stocksData: Record<string, any> = {
    'AAPL': {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      price: 187.32,
      change: 1.56,
      changePercent: 0.84,
      historicalData: generateHistoricalData(185)
    },
    'MSFT': {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      price: 415.23,
      change: -2.45,
      changePercent: -0.59,
      historicalData: generateHistoricalData(420)
    },
    'GOOGL': {
      symbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      price: 163.45,
      change: 0.78,
      changePercent: 0.48,
      historicalData: generateHistoricalData(162)
    },
    'AMZN': {
      symbol: 'AMZN',
      companyName: 'Amazon.com, Inc.',
      price: 178.95,
      change: -1.32,
      changePercent: -0.73,
      historicalData: generateHistoricalData(180)
    },
    'TSLA': {
      symbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      price: 246.47,
      change: 5.82,
      changePercent: 2.42,
      historicalData: generateHistoricalData(240)
    }
  };

  // Return data for the requested symbol, or generate random data if not in our predefined list
  if (stocksData[symbol]) {
    return stocksData[symbol];
  } else {
    // Generate random data for unknown symbols
    const basePrice = 100 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 5;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      companyName: `${symbol}`,
      price: basePrice,
      change,
      changePercent,
      historicalData: generateHistoricalData(basePrice)
    };
  }
};

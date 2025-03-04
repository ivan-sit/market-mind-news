
// In a real app, these would be actual API calls to stock data providers

export const fetchPopularStocks = async (): Promise<string[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a list of popular stock symbols
  return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
};

export const fetchStockData = async (symbol: string) => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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
      companyName: `${symbol} Corporation`,
      price: basePrice,
      change,
      changePercent,
      historicalData: generateHistoricalData(basePrice)
    };
  }
};

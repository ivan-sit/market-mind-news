
// In a real app, this would call an AI model API or a market data provider

export const getMarketAnalysis = async () => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get current date for the analysis
  const now = new Date();
  
  // Ensure trend is one of the allowed values: 'bearish', 'bullish', or 'neutral'
  const trendOptions: ['bearish', 'bullish', 'neutral'] = ['bearish', 'bullish', 'neutral'];
  const randomTrend = (): 'bearish' | 'bullish' | 'neutral' => {
    const random = Math.random();
    if (random > 0.6) return 'bearish';
    if (random > 0.3) return 'bullish';
    return 'neutral';
  };
  
  // Generate mock data
  return {
    summary: "Based on recent market data and news, there's downward pressure on major indices due to concerns about potential new tariffs and ongoing geopolitical tensions. Tech stocks appear particularly vulnerable this week, while defensive sectors like utilities and consumer staples may outperform. Investors should prepare for increased volatility in the coming days as markets digest new economic data releases.",
    trend: randomTrend(),
    confidence: Math.floor(Math.random() * 40) + 45, // 45-85% confidence
    noteworthy: [
      {
        symbol: "NVDA",
        change: -8.54,
        reason: "Facing pressure from potential new export restrictions to China",
        type: "drop" as const
      },
      {
        symbol: "META",
        change: 5.27,
        reason: "Rallying after positive earnings report and increased user engagement metrics",
        type: "surge" as const
      },
      {
        symbol: "TSLA",
        change: -3.62,
        reason: "Declining amid broader market concerns and production challenges",
        type: "drop" as const
      },
      {
        symbol: "XOM",
        change: 2.85,
        reason: "Gaining as oil prices rise due to heightened Middle East tensions",
        type: "surge" as const
      }
    ],
    factors: [
      "Potential new tariffs on Chinese imports creating uncertainty",
      "Federal Reserve signals maintaining current interest rates",
      "Mixed corporate earnings with 65% of S&P 500 companies beating expectations",
      "Rising treasury yields putting pressure on growth stocks",
      "Increasing geopolitical tensions affecting global trade outlook"
    ],
    updatedAt: now.toISOString()
  };
};

export type StockRecommendation = {
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  timeHorizon: 'short-term' | 'medium-term' | 'long-term';
};

export const getStockRecommendation = async (symbol: string): Promise<StockRecommendation> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would call an AI model API
  // For now, we'll generate pseudo-random recommendations
  const random = Math.random();
  
  // Predefined reasons for specific stocks (for a more realistic mock)
  const stockReasons: Record<string, { buy: string[], sell: string[], hold: string[] }> = {
    'AAPL': {
      buy: [
        "Strong product ecosystem with high customer loyalty",
        "Continued growth in services revenue and wearables",
        "Stable cash flow and aggressive share buyback program"
      ],
      sell: [
        "Slowing iPhone growth and market saturation",
        "Increasing competition in key markets",
        "Potential regulatory challenges in app store business"
      ],
      hold: [
        "Steady performance but limited short-term catalysts",
        "Balanced risk-reward ratio at current valuation",
        "Wait for next product cycle before reassessing position"
      ]
    },
    'MSFT': {
      buy: [
        "Cloud business (Azure) showing strong growth momentum",
        "Successful AI integration across product suite",
        "Dominant position in enterprise software market"
      ],
      sell: [
        "Potential slowdown in cloud growth rate",
        "High valuation relative to historical averages",
        "Facing increased competition in AI and cloud services"
      ],
      hold: [
        "Solid fundamentals but priced for perfection",
        "Monitor upcoming earnings for growth trajectory",
        "Consider dollar-cost averaging to build position"
      ]
    },
    'GOOGL': {
      buy: [
        "Digital advertising recovery showing positive signs",
        "Strong position in AI with practical applications",
        "YouTube and Cloud segments driving growth"
      ],
      sell: [
        "Regulatory concerns and potential antitrust actions",
        "Increased competition in core advertising business",
        "Rising costs for AI development pressuring margins"
      ],
      hold: [
        "Await more clarity on regulatory environment",
        "Monitor AI monetization progress",
        "Consider rotation within tech sector"
      ]
    }
  };
  
  // Default reasons for stocks not in our predefined list
  const defaultReasons = {
    buy: [
      "Technical indicators suggest upward momentum",
      "Recent financial results exceeded analyst expectations",
      "Industry trends support continued growth",
      "Valuation appears attractive relative to peers"
    ],
    sell: [
      "Technical analysis indicates a bearish trend",
      "Recent earnings disappointment suggests fundamental weaknesses",
      "Industry headwinds likely to impact performance",
      "Valuation appears stretched relative to growth prospects"
    ],
    hold: [
      "Mixed signals in recent performance metrics",
      "Current price reflects fair value based on available information",
      "Monitor upcoming catalysts before adjusting position",
      "Risk-reward profile currently balanced"
    ]
  };
  
  // Select recommendation type based on random value
  let recommendation: 'buy' | 'sell' | 'hold';
  if (random > 0.6) recommendation = 'buy';
  else if (random > 0.3) recommendation = 'sell';
  else recommendation = 'hold';
  
  // Get relevant reasons
  const reasons = stockReasons[symbol] || defaultReasons;
  const reasonsList = reasons[recommendation];
  const reasoning = reasonsList[Math.floor(Math.random() * reasonsList.length)];
  
  // Generate random confidence level (higher for known stocks)
  const confidence = stockReasons[symbol] 
    ? Math.floor(Math.random() * 20) + 65 // 65-85% for known stocks
    : Math.floor(Math.random() * 30) + 55; // 55-85% for unknown stocks
  
  // Randomly select time horizon
  const timeHorizons: ['short-term', 'medium-term', 'long-term'] = ['short-term', 'medium-term', 'long-term'];
  const timeHorizon = timeHorizons[Math.floor(Math.random() * timeHorizons.length)];
  
  return {
    recommendation,
    confidence,
    reasoning,
    timeHorizon
  };
};


// In a real app, this would call an AI model API or a market data provider

export const getMarketAnalysis = async () => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get current date for the analysis
  const now = new Date();
  
  // Generate mock data
  return {
    summary: "Based on recent market data and news, there's downward pressure on major indices due to concerns about potential new tariffs and ongoing geopolitical tensions. Tech stocks appear particularly vulnerable this week, while defensive sectors like utilities and consumer staples may outperform. Investors should prepare for increased volatility in the coming days as markets digest new economic data releases.",
    trend: Math.random() > 0.6 ? 'bearish' : Math.random() > 0.5 ? 'bullish' : 'neutral',
    confidence: Math.floor(Math.random() * 40) + 45, // 45-85% confidence
    noteworthy: [
      {
        symbol: "NVDA",
        change: -8.54,
        reason: "Facing pressure from potential new export restrictions to China",
        type: "drop"
      },
      {
        symbol: "META",
        change: 5.27,
        reason: "Rallying after positive earnings report and increased user engagement metrics",
        type: "surge"
      },
      {
        symbol: "TSLA",
        change: -3.62,
        reason: "Declining amid broader market concerns and production challenges",
        type: "drop"
      },
      {
        symbol: "XOM",
        change: 2.85,
        reason: "Gaining as oil prices rise due to heightened Middle East tensions",
        type: "surge"
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

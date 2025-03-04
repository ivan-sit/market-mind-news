import React, { useState, useEffect } from 'react';
import { StockChart } from './StockChart';
import { fetchStockData, fetchPopularStocks } from '../utils/stockService';
import { getStockRecommendation, StockRecommendation } from '../utils/analysisService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, RefreshCw, TrendingUp, TrendingDown, MinusCircle, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData: { date: string; close: number }[];
}

export const StockTab = () => {
  const [popularStocks, setPopularStocks] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [recommendation, setRecommendation] = useState<StockRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPopularStocks = async () => {
      try {
        const stocks = await fetchPopularStocks();
        setPopularStocks(stocks);
        if (stocks.length > 0) {
          setSelectedStock(stocks[0]);
        }
      } catch (err) {
        console.error('Failed to fetch popular stocks:', err);
        setError('Failed to load popular stocks.');
      }
    };

    loadPopularStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      loadStockData(selectedStock);
    }
  }, [selectedStock]);

  const loadStockData = async (symbol: string) => {
    setIsLoading(true);
    setIsLoadingRecommendation(true);
    setError(null);
    setRecommendation(null);
    
    try {
      const data = await fetchStockData(symbol);
      setStockData(data);
      
      // Get AI recommendation
      try {
        const rec = await getStockRecommendation(symbol);
        setRecommendation(rec);
      } catch (recErr) {
        console.error(`Failed to fetch recommendation for ${symbol}:`, recErr);
        // We don't set the main error here, just log it and leave recommendation as null
      } finally {
        setIsLoadingRecommendation(false);
      }
    } catch (err) {
      console.error(`Failed to fetch data for ${symbol}:`, err);
      setError(`Failed to load stock data for ${symbol}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedStock(searchQuery.trim().toUpperCase());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'buy': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'sell': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'hold': return <MinusCircle className="w-5 h-5 text-amber-500" />;
      default: return null;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy': return "bg-green-500/10 text-green-600 border-green-200";
      case 'sell': return "bg-red-500/10 text-red-600 border-red-200";
      case 'hold': return "bg-amber-500/10 text-amber-600 border-amber-200";
      default: return "";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel p-4 mb-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by symbol (e.g., AAPL, MSFT)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pr-8"
              />
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((symbol) => (
              <Button
                key={symbol}
                variant={selectedStock === symbol ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStock(symbol)}
                className="rounded-full"
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center p-8 rounded-lg glass-panel">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <Card className="glass-panel animate-pulse">
          <CardContent className="p-6">
            <div className="loading-skeleton h-8 w-1/3 mb-4 rounded"></div>
            <div className="loading-skeleton h-6 w-1/4 mb-8 rounded"></div>
            <div className="loading-skeleton h-64 w-full rounded"></div>
          </CardContent>
        </Card>
      ) : stockData ? (
        <>
          <Card className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                <div>
                  <h2 className="text-2xl font-bold">{stockData.companyName} ({stockData.symbol})</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xl font-medium">${stockData.price.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadStockData(stockData.symbol)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>
              
              <div className="h-[350px] w-full">
                <StockChart data={stockData.historicalData} />
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation Card */}
          <Card className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Market Recommendation
              </h3>
              
              {isLoadingRecommendation ? (
                <div className="animate-pulse space-y-3">
                  <div className="loading-skeleton h-8 w-1/4 rounded"></div>
                  <div className="loading-skeleton h-4 w-3/4 rounded"></div>
                  <div className="loading-skeleton h-4 w-1/2 rounded"></div>
                </div>
              ) : recommendation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`text-sm py-1 px-3 capitalize ${getRecommendationColor(recommendation.recommendation)}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {getRecommendationIcon(recommendation.recommendation)}
                        {recommendation.recommendation}
                      </span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {recommendation.timeHorizon} outlook • {recommendation.confidence}% confidence
                    </span>
                  </div>
                  
                  <p className="text-sm md:text-base">{recommendation.reasoning}</p>
                  
                  <div className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                    Note: This is an AI-generated recommendation for educational purposes only. 
                    Always conduct your own research before making investment decisions.
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Unable to generate recommendation at this time. Please try again later.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center p-8 rounded-lg glass-panel">
          <p className="text-muted-foreground">Select a stock to view its chart.</p>
        </div>
      )}
    </div>
  );
};

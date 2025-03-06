
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { getMarketAnalysis } from '../utils/analysisService';
import { OpenAIKeyInput } from './OpenAIKeyInput';
import { toast } from 'sonner';

interface MarketInsight {
  summary: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  noteworthy: {
    symbol: string;
    change: number;
    reason: string;
    type: 'surge' | 'drop';
  }[];
  factors: string[];
  updatedAt: string;
}

export const MarketAnalysisTab = () => {
  const [analysis, setAnalysis] = useState<MarketInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMarketAnalysis();
      setAnalysis(data);
      toast.success("Analysis updated successfully");
    } catch (err: any) {
      console.error('Failed to fetch market analysis:', err);
      setError(err.message || 'Failed to load market analysis. Please try again later.');
      toast.error(err.message || 'Failed to load market analysis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const getTrendIcon = (trend: 'bullish' | 'bearish' | 'neutral') => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-6 w-6 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-6 w-6 text-red-500" />;
      case 'neutral':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getConfidenceBar = (confidence: number) => {
    const width = `${confidence}%`;
    const color = confidence > 70 
      ? 'bg-green-500' 
      : confidence > 40 
        ? 'bg-yellow-500' 
        : 'bg-red-500';
    
    return (
      <div className="w-full bg-muted rounded-full h-2.5 mt-1 mb-3">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width }}></div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <OpenAIKeyInput />
      
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={loadAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </Button>
      </div>

      {error && (
        <div className="text-center p-8 rounded-lg glass-panel">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <Card className="glass-panel animate-pulse">
          <CardContent className="p-6">
            <div className="loading-skeleton h-8 w-2/3 mb-4 rounded"></div>
            <div className="loading-skeleton h-6 w-full mb-2 rounded"></div>
            <div className="loading-skeleton h-6 w-5/6 mb-6 rounded"></div>
            <div className="loading-skeleton h-4 w-full mb-2 rounded"></div>
            <div className="loading-skeleton h-4 w-full mb-2 rounded"></div>
            <div className="loading-skeleton h-4 w-3/4 mb-4 rounded"></div>
            <div className="space-y-3">
              <div className="loading-skeleton h-20 w-full rounded"></div>
              <div className="loading-skeleton h-20 w-full rounded"></div>
            </div>
          </CardContent>
        </Card>
      ) : analysis ? (
        <div className="space-y-6">
          <Card className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                {getTrendIcon(analysis.trend)}
                <h2 className="text-2xl font-bold">
                  Market Outlook: {analysis.trend === 'bullish' ? 'Positive' : analysis.trend === 'bearish' ? 'Negative' : 'Mixed'}
                </h2>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Confidence</span>
                  <span className="font-medium">{analysis.confidence}%</span>
                </div>
                {getConfidenceBar(analysis.confidence)}
              </div>
              
              <p className="text-lg mb-6">{analysis.summary}</p>
              
              <h3 className="text-lg font-semibold mb-3">Key Market Factors</h3>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                {analysis.factors.map((factor, index) => (
                  <li key={index} className="text-muted-foreground">{factor}</li>
                ))}
              </ul>
              
              <div className="text-sm text-muted-foreground text-right">
                Last updated: {new Date(analysis.updatedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {analysis.noteworthy.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Noteworthy Stock Movements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.noteworthy.map((stock, index) => (
                  <Card 
                    key={index} 
                    className={`glass-panel overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up border-l-4 ${
                      stock.type === 'surge' ? 'border-l-green-500' : 'border-l-red-500'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg">{stock.symbol}</h4>
                        <div className={`flex items-center ${
                          stock.type === 'surge' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {stock.type === 'surge' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          <span className="font-semibold">{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{stock.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 rounded-lg glass-panel">
          <p className="text-muted-foreground">No market analysis available. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

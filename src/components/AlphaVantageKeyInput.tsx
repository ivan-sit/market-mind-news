
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getAlphaVantageApiKey, setAlphaVantageApiKey } from '../config/apiKeys';
import { toast } from 'sonner';

export const AlphaVantageKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if a key is already saved
    const savedKey = getAlphaVantageApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setAlphaVantageApiKey(apiKey.trim());
      setIsKeySet(true);
      toast.success("Alpha Vantage API key saved");
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    setAlphaVantageApiKey('');
    setIsKeySet(false);
    localStorage.removeItem('alpha_vantage_api_key');
    toast.info("Alpha Vantage API key cleared");
  };

  return (
    <Card className="glass-panel mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <LineChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Alpha Vantage API Key</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Get your free Alpha Vantage API key at alphavantage.co. Keys are stored locally only.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            {isKeySet 
              ? "Your API key is set. The app will now fetch real stock data from Alpha Vantage." 
              : "Enter your Alpha Vantage API key to enable real stock data."}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Alpha Vantage API key"
              className="flex-1"
            />
            {isKeySet ? (
              <Button variant="destructive" onClick={handleClearKey}>
                Clear Key
              </Button>
            ) : (
              <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
                Save Key
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Get a free Alpha Vantage API key
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

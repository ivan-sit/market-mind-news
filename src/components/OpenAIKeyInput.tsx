
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Info } from 'lucide-react';
import { setOpenAIApiKey, getOpenAIApiKey } from '../config/apiKeys';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export const OpenAIKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const savedKey = getOpenAIApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setOpenAIApiKey(apiKey.trim());
      setIsKeySet(true);
      toast.success("API key saved successfully");
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    setOpenAIApiKey('');
    setIsKeySet(false);
    localStorage.removeItem('openai_api_key');
    toast.info("API key cleared");
  };

  return (
    <Card className="glass-panel mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <Key className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">OpenAI API Key</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Used for ranking news articles and generating stock recommendations using gpt-4o-mini. API keys are stored locally and never sent to our servers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            {isKeySet 
              ? "Your API key is set. The app will now rank news by importance and provide real AI stock analysis." 
              : "Enter your OpenAI API key to enable AI-powered market analysis and news ranking."}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
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
            Your API key is stored in your browser's local storage and is never sent to our servers.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

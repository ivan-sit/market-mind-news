
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsTab } from './NewsTab';
import { StockTab } from './StockTab';
import { MarketAnalysisTab } from './MarketAnalysisTab';
import { Newspaper, TrendingUp, Brain } from "lucide-react";

export const Layout = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="loading-skeleton w-12 h-12 rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-8">
        <div className="flex flex-col items-center justify-between mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Market Mind</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Stay informed with market-moving news and real-time stock data
            </p>
          </div>
        </div>
      </header>
      
      <main>
        <Tabs 
          defaultValue="news" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="glass-panel">
              <TabsTrigger 
                value="news" 
                className="flex items-center gap-2 px-6 py-3 text-sm"
                onClick={() => setActiveTab("news")}
              >
                <Newspaper className="w-4 h-4" />
                <span>Market News</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stocks" 
                className="flex items-center gap-2 px-6 py-3 text-sm"
                onClick={() => setActiveTab("stocks")}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Stock Charts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="flex items-center gap-2 px-6 py-3 text-sm"
                onClick={() => setActiveTab("analysis")}
              >
                <Brain className="w-4 h-4" />
                <span>AI Analysis</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="mt-6">
            <TabsContent value="news" className="animate-slide-up mt-0">
              <NewsTab />
            </TabsContent>
            <TabsContent value="stocks" className="animate-slide-up mt-0">
              <StockTab />
            </TabsContent>
            <TabsContent value="analysis" className="animate-slide-up mt-0">
              <MarketAnalysisTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <footer className="mt-16 mb-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Market Mind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

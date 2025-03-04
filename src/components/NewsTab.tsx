
import React, { useState, useEffect } from 'react';
import { NewsCard } from './NewsCard';
import { fetchNews } from '../utils/newsService';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
}

export const NewsTab = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newsData = await fetchNews();
      setNews(newsData);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(newsData.map(item => item.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load market news. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const filteredNews = selectedCategory 
    ? news.filter(item => item.category === selectedCategory)
    : news;

  const renderSkeletonCards = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="glass-panel rounded-lg overflow-hidden mb-4 p-4">
        <div className="loading-skeleton h-6 w-3/4 mb-3 rounded"></div>
        <div className="loading-skeleton h-4 w-1/2 mb-2 rounded"></div>
        <div className="loading-skeleton h-4 w-full mb-2 rounded"></div>
        <div className="loading-skeleton h-4 w-2/3 rounded"></div>
      </div>
    ));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full text-xs"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadNews}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="text-center p-8 rounded-lg glass-panel">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 animate-fade-in">
        {isLoading
          ? renderSkeletonCards()
          : filteredNews.map((item, index) => (
              <div
                key={item.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <NewsCard news={item} />
              </div>
            ))}
        
        {!isLoading && filteredNews.length === 0 && (
          <div className="text-center p-8 rounded-lg glass-panel">
            <p className="text-muted-foreground">No news articles found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsItemProps {
  news: {
    id: string;
    title: string;
    description: string;
    source: string;
    url: string;
    publishedAt: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    category: string;
  };
}

export const NewsCard = ({ news }: NewsItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderSentimentIcon = () => {
    switch (news.sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const sentimentColor = {
    positive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  }[news.sentiment];

  return (
    <Card className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs capitalize">
              {news.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(news.publishedAt)}
            </span>
            <Badge className={`ml-auto text-xs ${sentimentColor}`}>
              <span className="flex items-center gap-1">
                {renderSentimentIcon()}
                <span>
                  {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                </span>
              </span>
            </Badge>
          </div>
          
          <h3 className="text-lg font-medium leading-tight">{news.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {news.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">Source: {news.source}</span>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline transition-all"
            >
              <span>Read more</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

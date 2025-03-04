
# Market Analyst Dashboard

A real-time market analysis dashboard built with React and TypeScript, providing stock visualization, AI-powered market insights, and financial news monitoring.

## Features

### Stock Chart Tab
- Track and visualize stock price movements
- Search for any stock by ticker symbol
- View popular stocks with a single click
- Get AI-generated buy/sell recommendations for any stock

### Market Analysis Tab
- Review overall market sentiment (bullish, bearish, or neutral)
- See confidence ratings for market predictions
- Track noteworthy stock movements with explanations
- Monitor key market factors affecting trading conditions

### News Tab
- Browse the latest financial news articles
- Filter news by category (Economy, Technology, Energy, etc.)
- See sentiment analysis for each news item (positive, negative, neutral)

## How It Works

This application uses simulated APIs to demonstrate functionality without requiring real API keys:

- **Stock Data**: Mock API in `stockService.ts` generates realistic stock data with randomized historical prices
- **Market Analysis**: Simulated AI recommendations in `analysisService.ts` provide market insights and stock recommendations
- **Financial News**: Mock news feed in `newsService.ts` displays recent market news with categorization

In a production environment, these services could be connected to real financial data providers like:
- Alpha Vantage or Yahoo Finance for stock data
- OpenAI or other AI services for market analysis
- Bloomberg, Reuters, or financial news APIs for real-time news

## Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **shadcn/ui**: Component library for consistent UI
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library for stock charts
- **Lucide**: Icon library for clean UI elements

## Getting Started

1. Clone the repository
   ```
   git clone <REPOSITORY_URL>
   ```

2. Navigate to the project directory
   ```
   cd market-analyst-dashboard
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Deployment

This project can be deployed to any static hosting service such as Netlify, Vercel, or GitHub Pages.

To build the project for production:
```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.

## Future Enhancements

- Connect to real financial data APIs
- Add user authentication for personalized watchlists
- Implement portfolio tracking functionality
- Add real-time data updates via WebSockets
- Expand news sources and filtering options

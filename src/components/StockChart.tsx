
import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';

interface DataPoint {
  date: string;
  close: number;
}

interface StockChartProps {
  data: DataPoint[];
}

export const StockChart = ({ data }: StockChartProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 shadow-md rounded-md border border-white/20">
          <p className="text-sm font-medium">{formatTooltipDate(label)}</p>
          <p className="text-sm text-primary">
            <span className="font-medium">Price:</span> ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  // Calculate price change color
  const priceChangeColor = data.length > 1 && 
    data[0].close > data[data.length - 1].close 
    ? "rgba(239, 68, 68, 0.7)" 
    : "rgba(34, 197, 94, 0.7)";
    
  const gradientColor = data.length > 1 && 
    data[0].close > data[data.length - 1].close 
    ? ["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0)"] 
    : ["rgba(34, 197, 94, 0.1)", "rgba(34, 197, 94, 0)"];

  return (
    <ResponsiveContainer width="100%" height="100%" className="animate-fade-in">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor[0]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={gradientColor[1]} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis} 
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
          tickLine={false}
          axisLine={false}
          minTickGap={30}
        />
        <YAxis 
          tickFormatter={formatYAxis} 
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={data[0]?.close} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
        <Area
          type="monotone"
          dataKey="close"
          stroke={priceChangeColor}
          strokeWidth={2}
          fill="url(#colorGradient)"
          dot={false}
          activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

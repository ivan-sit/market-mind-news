
import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
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
        <div className="glass-panel p-3 shadow-md rounded-md border border-border">
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

  return (
    <ResponsiveContainer width="100%" height="100%" className="animate-fade-in">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
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
        <Line
          type="monotone"
          dataKey="close"
          stroke={priceChangeColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

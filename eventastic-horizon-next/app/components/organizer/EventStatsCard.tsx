import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface EventStatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend?: string;
  trendUp?: boolean;
}

const EventStatsCard: React.FC<EventStatsCardProps> = ({ 
  title,
  value,
  icon,
  trend,
  trendUp = true
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {React.cloneElement(icon as React.ReactElement, {
            })}
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center text-xs font-medium">
            {trendUp ? (
              <ArrowUp style={{ height: 12, width: 12, color: '#22c55e', marginRight: 4 }} />
            ) : (
              <ArrowDown style={{ height: 12, width: 12, color: '#ef4444', marginRight: 4 }} />
            )}
            <span style={{ color: trendUp ? '#22c55e' : '#ef4444' }}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventStatsCard;

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { 
  Zap, 
  Gauge, 
  Leaf, 
  Cloud 
} from "lucide-react";

interface PlaceholderDashboardProps {
  variant: 'analytics' | 'fleet' | 'geospatial';
  className?: string;
}

interface AnimatedBarProps {
  height: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ height }) => (
  <motion.div
    initial={{ height: 0 }}
    animate={{ height: `${height}%` }}
    transition={{
      duration: 0.7,
      ease: 'easeOut',
    }}
    className="bg-primary/25 w-full rounded-t-sm shadow-sm"
    aria-hidden="true"
  />
);


export const PlaceholderDashboard: React.FC<PlaceholderDashboardProps> = ({
  variant,
  className,
}) => {
  return (
    <div className={cn('w-full h-full bg-background/60 p-6 rounded-lg shadow-lg', className)}>
      {variant === 'analytics' && (
        <div className="w-full h-full flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { 
                label: 'Power Output', 
                value: '24.5 MW',
                trend: '+2.3%',
                status: 'default' as const,
                icon: (
                  <Zap className="w-5 h-5 text-primary/70" />
                )
              },
              { 
                label: 'Efficiency', 
                value: '98.2%',
                icon: (
                  <Gauge className="w-5 h-5 text-primary/70" />
                )
              },
              { 
                label: 'CO₂ Avoided', 
                value: '12.4t',
                icon: (
                  <Leaf className="w-5 h-5 text-primary/70" />
                )
              },
              { 
                label: 'Weather Index', 
                value: '0.95',
                icon: (
                  <Cloud className="w-5 h-5 text-primary/70" />
                )
              }
            ].map((metric, i) => (
              <Card key={i} className="p-5 relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  {metric.trend && metric.status && (
                    <Badge variant={metric.status} className="text-xs">
                      {metric.trend}
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-semibold">{metric.value}</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/40" />
              </Card>
            ))}
          </div>
          <Card className="flex-1 p-8 rounded-xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background" />
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-3">
                {['1H', '24H', '7D', '30D'].map((period) => (
                  <div
                    key={period}
                    className="px-4 py-2 rounded-md text-xs bg-muted transition-colors duration-300 hover:bg-muted/75"
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-end h-[calc(100%-3rem)] gap-3 relative">
              {[65, 80, 45, 90, 60, 75, 85, 70, 95, 55, 80, 70].map((height, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex-1">
                        <AnimatedBar height={height} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{height}% efficiency</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </Card>
        </div>
      )}

      {variant === 'fleet' && (
        <div className="w-full h-full flex flex-col gap-6">
          <Card className="p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Live Fleet Status</div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex-1 p-6 rounded-xl shadow-inner">
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-3 bg-muted/60 rounded-md mb-3">
                {['Asset ID', 'Status', 'Output', 'Efficiency', 'Alerts', 'Actions'].map((header) => (
                  <div key={header} className="text-sm font-semibold text-muted-foreground">
                    {header}
                  </div>
                ))}
              </div>
              <div className="flex-1 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-3 hover:bg-muted/60 rounded-md relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {[...Array(6)].map((_, j) => (
                      <Skeleton key={j} className="h-9" />
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {variant === 'geospatial' && (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6">
          <Card className="flex-1 p-6 bg-muted/60 rounded-xl shadow-lg">
            <div className="w-full h-[calc(100%-2rem)] rounded-lg bg-primary/10 border-2 border-dashed border-primary/25 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbC1vcGFjaXR5PSIuNSIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9nPjwvc3ZnPg==')]" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
            </div>
          </Card>
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <Card className="p-4 rounded-xl shadow-md grow">
              <div className="h-full flex flex-col">
                <div className="text-sm font-semibold text-muted-foreground mb-2">Wind Farm Conditions</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Wind Speed',
                    'Wind Direction',
                    'Air Density',
                    'Turbulence',
                    'Atmospheric Pressure',
                    'Temperature'
                  ].map((label) => (
                    <div key={label} className="space-y-1.5">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl shadow-md grow">
              <div className="h-full flex flex-col">
                <div className="text-sm font-semibold text-muted-foreground mb-2">Solar Farm Conditions</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Solar Irradiance',
                    'Cloud Cover',
                    'Panel Temperature',
                    'Ambient Temperature',
                    'Humidity',
                    'UV Index'
                  ].map((label) => (
                    <div key={label} className="space-y-1.5">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-3 rounded-xl shadow-inner">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-20" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
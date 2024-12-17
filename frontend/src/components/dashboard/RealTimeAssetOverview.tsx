import * as React from 'react';
import { Asset } from '@/types/asset';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExtendedAsset extends Asset {
  location?: string;
  status?: 'Online' | 'Offline' | 'Maintenance';
  power?: string;
}

interface RealTimeAssetOverviewProps {
  asset: ExtendedAsset;
}

const getStatusConfig = (status: ExtendedAsset['status']) => {
  switch (status) {
    case 'Online':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-green-500/50 bg-green-500/10 text-green-700',
          'dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400',
          'font-medium'
        ),
        indicator: 'bg-green-500 dark:bg-green-400'
      };
    case 'Offline':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-red-500/50 bg-red-500/10 text-red-700',
          'dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400',
          'font-medium'
        ),
        indicator: 'bg-red-500 dark:bg-red-400'
      };
    case 'Maintenance':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-yellow-500/50 bg-yellow-500/10 text-yellow-700',
          'dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400',
          'font-medium'
        ),
        indicator: 'bg-yellow-500 dark:bg-yellow-400'
      };
    default:
      return {
        variant: 'secondary' as const,
        className: 'font-medium',
        indicator: 'bg-muted-foreground'
      };
  }
};

export const RealTimeAssetOverview: React.FC<RealTimeAssetOverviewProps> = ({ asset }) => {
  const statusConfig = getStatusConfig(asset.status);

  return (
    <Card className="w-full h-full transition-all duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">{asset.name}</h2>
          <p className="text-sm text-muted-foreground">Real-time Overview</p>
        </div>
        {asset.status && (
          <Badge 
            variant={statusConfig.variant}
            className={cn("capitalize", statusConfig.className)}
          >
            {asset.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100%-4rem)] pr-4">
          <div className="space-y-6">
            {/* Asset Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Asset Information</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                  <span className="text-sm font-medium text-muted-foreground">Asset ID</span>
                  <span className="text-sm font-mono">{asset.id}</span>
                </div>
                {asset.location && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                    <span className="text-sm font-medium text-muted-foreground">Location</span>
                    <span className="text-sm">{asset.location}</span>
                  </div>
                )}
                {asset.power && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                    <span className="text-sm font-medium text-muted-foreground">Power Output</span>
                    <span className="text-sm font-mono">{asset.power}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />
            
            {/* Real-time Metrics */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Real-time Metrics</h3>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                <div className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  statusConfig.indicator
                )} />
                <span className="text-sm text-muted-foreground">
                  Monitoring real-time data...
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
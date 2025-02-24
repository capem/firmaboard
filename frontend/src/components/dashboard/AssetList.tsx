import * as React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Asset } from '@/types/asset';
import { api, ENDPOINTS } from '@/config/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast"

interface AssetListProps {
  onSelectAsset: (asset: Asset) => void;
}

const getStatusConfig = (status: Asset['status']) => {
  switch (status) {
    case 'Online':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-green-500/50 bg-green-500/10 text-green-700',
          'dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400',
          'font-medium'
        )
      };
    case 'Offline':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-red-500/50 bg-red-500/10 text-red-700',
          'dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400',
          'font-medium'
        )
      };
    case 'Maintenance':
      return {
        variant: 'outline' as const,
        className: cn(
          'border-yellow-500/50 bg-yellow-500/10 text-yellow-700',
          'dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400',
          'font-medium'
        )
      };
    default:
      return {
        variant: 'secondary' as const,
        className: 'font-medium'
      };
  }
};

export const AssetList: React.FC<AssetListProps> = ({ onSelectAsset }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast()

  // Fetch assets only on mount
  React.useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get<Asset[]>(ENDPOINTS.farms.assets);
        setAssets(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []); // Empty dependency array since we only want to fetch on mount

  const handleAssetClick = React.useCallback((asset: Asset) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectAsset(asset);
  }, [onSelectAsset]);

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            Error loading assets: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Asset List</h2>
        <p className="text-sm text-muted-foreground">
          Select an asset to view real-time details
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100%-2rem)] rounded-md border">
          <Table>
            <TableHeader className="draggable-cancel bg-muted/50 sticky top-0">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Location</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Power Output</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="draggable-cancel">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No assets found
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset, index) => {
                  const statusConfig = getStatusConfig(asset.status);
                  return (
                    <TableRow
                      key={`${asset.id}-${index}`}
                      className={cn(
                        'group cursor-pointer transition-colors',
                        'hover:bg-muted/50 data-[state=selected]:bg-muted',
                        'focus-visible:bg-muted/70 focus-visible:outline-none'
                      )}
                      onClick={handleAssetClick(asset)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectAsset(asset);
                        }
                      }}
                    >
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig.variant}
                          className={cn("capitalize", statusConfig.className)}
                        >
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{asset.power}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
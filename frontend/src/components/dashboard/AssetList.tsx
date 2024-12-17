import * as React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Asset } from '@/types/asset';

// TODO: Django API Integration
// - Fetch asset list with pagination and filtering
// - Implement real-time status updates
// - Endpoints needed:
//   * GET /api/assets?page={page}&filter={filter}
//   * GET /api/assets/status
//   * WebSocket: ws://domain/ws/assets/status-updates/

interface ExtendedAsset extends Asset {
  location: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  power: string;
}

interface AssetListProps {
  onSelectAsset: (asset: ExtendedAsset) => void;
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
  // TODO: Implement API hooks and pagination
  // const [page, setPage] = React.useState(1)
  // const [filter, setFilter] = React.useState('')
  // const { data, isLoading } = useQuery(['assets', page, filter], fetchAssets)
  // useWebSocket('ws://domain/ws/assets/status-updates/')

  const assets: ExtendedAsset[] = [
    { id: 1, name: 'Wind Farm Alpha', location: 'California', status: 'Online', power: '300 MW' },
    { id: 2, name: 'Solar Plant Beta', location: 'Nevada', status: 'Maintenance', power: '200 MW' },
    { id: 3, name: 'Hybrid Facility Gamma', location: 'Texas', status: 'Offline', power: '400 MW' },
  ];

  const handleAssetClick = (asset: ExtendedAsset) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectAsset(asset);
  };

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
              {assets.map((asset) => {
                const statusConfig = getStatusConfig(asset.status);
                return (
                  <TableRow
                    key={asset.id}
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
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
import * as React from 'react';
import type { Layout } from 'react-grid-layout';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface DashboardBreakpoints {
  lg: number;
  md: number;
  sm: number;
}

export interface DashboardCols {
  lg: number;
  md: number;
  sm: number;
}

export const DASHBOARD_BREAKPOINTS: DashboardBreakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
} as const;

export const DASHBOARD_COLS: DashboardCols = {
  lg: 12,
  md: 8,
  sm: 6,
} as const;

export const DASHBOARD_LAYOUTS: { [key: string]: Layout[] } = {
  lg: [
    { i: 'overview', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'assetList', x: 0, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
    { i: 'realTimeOverview', x: 4, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
    { i: 'mapView', x: 8, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
    { i: 'analytics', x: 0, y: 12, w: 12, h: 8, minW: 6, minH: 6 },
  ],
  md: [
    { i: 'overview', x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'assetList', x: 0, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
    { i: 'realTimeOverview', x: 4, y: 4, w: 4, h: 8, minW: 3, minH: 6 },
    { i: 'mapView', x: 0, y: 12, w: 8, h: 6, minW: 4, minH: 5 },
    { i: 'analytics', x: 0, y: 18, w: 8, h: 8, minW: 4, minH: 6 },
  ],
  sm: [
    { i: 'overview', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'assetList', x: 0, y: 4, w: 6, h: 6, minW: 3, minH: 5 },
    { i: 'realTimeOverview', x: 0, y: 10, w: 6, h: 6, minW: 3, minH: 5 },
    { i: 'mapView', x: 0, y: 16, w: 6, h: 6, minW: 3, minH: 5 },
    { i: 'analytics', x: 0, y: 22, w: 6, h: 8, minW: 3, minH: 6 },
  ],
} as const;

export interface DashboardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: 'default' | 'success' | 'warning' | 'error';
  isLoading?: boolean;
}

const getStatusVariant = (status: DashboardItemProps['status']) => {
  switch (status) {
    case 'success':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const DashboardItem = React.forwardRef<HTMLDivElement, DashboardItemProps>(
  ({ title, description, status, isLoading, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all",
          "hover:shadow-md",
          "data-[dragging=true]:shadow-lg data-[dragging=true]:cursor-grabbing",
          "data-[resizing=true]:shadow-lg",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {status && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={getStatusVariant(status)}
                    className={cn(
                      "ml-auto",
                      status === 'success' && "bg-success/20 text-success-foreground border-success/30 hover:bg-success/30",
                      status === 'warning' && "bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30",
                      status === 'error' && "bg-destructive/20 text-destructive-foreground border-destructive/30 hover:bg-destructive/30"
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Component Status: {status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex-1 p-4">{children}</div>
      </Card>
    );
  }
);
DashboardItem.displayName = "DashboardItem";

export const GRID_CONFIG = {
  className: cn(
    "layout",
    "[&_.react-grid-item]:transition-[background-color,box-shadow]",
    "[&_.react-grid-item.react-draggable-dragging]:z-50",
    "[&_.react-grid-placeholder]:bg-primary/10",
    "[&_.react-grid-placeholder]:rounded-xl",
    "[&_.react-grid-placeholder]:border-2",
    "[&_.react-grid-placeholder]:border-dashed",
    "[&_.react-grid-placeholder]:border-primary/25",
  ),
  rowHeight: 50,
  margin: [16, 16] as [number, number],
  containerPadding: [16, 16] as [number, number],
  isDraggable: true,
  isResizable: true,
  useCSSTransforms: true,
  preventCollision: false,
  compactType: 'vertical' as const,
} as const; 
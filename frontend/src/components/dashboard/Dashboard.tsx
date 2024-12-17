import * as React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardOverview } from './DashboardOverview';
import { AssetList } from './AssetList';
import { RealTimeAssetOverview } from './RealTimeAssetOverview';
import { MapView } from './MapView';
import { Analytics } from './Analytics';
import { Asset } from '@/types/asset';
import { cn } from '@/lib/utils';
import {
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLS,
  DASHBOARD_LAYOUTS,
  GRID_CONFIG,
  DashboardBreakpoints,
  DashboardCols
} from './DashboardLayout';

// Base styles for react-grid-layout
import './dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Types
interface ExtendedAsset extends Asset {
  location?: string;
  status?: 'Online' | 'Offline' | 'Maintenance';
  power?: string;
}

// Component-specific styles
const gridItemStyles = {
  base: cn(
    // Card styles
    "rounded-xl border bg-card text-card-foreground",
    // Shadow and hover effects
    "shadow-sm hover:shadow-md transition-shadow duration-200",
    // Grid item specific
    "react-grid-item overflow-hidden",
    // Dragging state
    "[&.react-draggable-dragging]:bg-muted/95",
    "[&.react-draggable-dragging]:shadow-lg",
    "[&.react-draggable-dragging]:ring-1",
    "[&.react-draggable-dragging]:ring-border"
  ),
};

export const Dashboard: React.FC = () => {
  // State
  const [selectedAsset, setSelectedAsset] = React.useState<ExtendedAsset | null>(null);

  // Effects
  React.useEffect(() => {
    const defaultAsset: ExtendedAsset = {
      id: 1,
      name: 'Wind Turbine A',
      location: 'Site 1',
      status: 'Online',
      power: '500 MW',
    };
    setSelectedAsset(defaultAsset);
  }, []);

  // Handlers
  const handleSelectAsset = (asset: ExtendedAsset) => {
    setSelectedAsset(asset);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 space-y-4 p-4 pt-2">
          <ResponsiveGridLayout
            {...GRID_CONFIG}
            layouts={DASHBOARD_LAYOUTS}
            breakpoints={DASHBOARD_BREAKPOINTS as unknown as { [P in keyof DashboardBreakpoints]: number }}
            cols={DASHBOARD_COLS as unknown as { [P in keyof DashboardCols]: number }}
            draggableCancel=".draggable-cancel"
            className="min-h-[calc(100vh-6rem)]"
          >
            {/* Dashboard Overview */}
            <div key="overview" className={gridItemStyles.base}>
              <DashboardOverview />
            </div>

            {/* Asset List */}
            <div key="assetList" className={gridItemStyles.base}>
              <AssetList onSelectAsset={handleSelectAsset} />
            </div>

            {/* Real-time Asset Overview */}
            <div key="realTimeOverview" className={gridItemStyles.base}>
              {selectedAsset ? (
                <RealTimeAssetOverview asset={selectedAsset} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No asset selected</p>
                </div>
              )}
            </div>

            {/* Map View */}
            <div key="mapView" className={gridItemStyles.base}>
              <MapView />
            </div>

            {/* Analytics */}
            <div key="analytics" className={gridItemStyles.base}>
              <Analytics />
            </div>
          </ResponsiveGridLayout>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
import * as React from "react"
import {
  Activity,
  Battery,
  BookOpen,
  Building2,
  Command,
  Database,
  LineChart,
  Settings2,
  ShieldCheck,
  Sun,
  Wind,
  Zap,
  Gauge,
  Clock,
  CloudRain,
  Cpu,
  FileText,
  LayoutDashboard,
  Leaf,
  Maximize2,
  Network,
  Power,
  Share2,
  Thermometer,
  Users,
  Map,
  Radio,
  Bell,
  Timer,
  Percent,
  CloudLightning,
  Binary,
  Boxes,
  Workflow,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useTenant } from "@/contexts/TenantContext"

const navMainData = [
  {
    title: "Command Center",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Executive Overview",
        url: "/dashboard",
        icon: Gauge,
      },
      {
        title: "Live Monitoring",
        url: "/dashboard/monitoring",
        icon: Activity,
      },
      {
        title: "Asset Health Index",
        url: "/dashboard/health",
        icon: Thermometer,
      },
    ],
  },
  {
    title: "Geospatial Intelligence",
    url: "/geospatial",
    icon: Map,
    items: [
      {
        title: "Asset Mapping",
        url: "/geospatial/assets",
        icon: Boxes,
      },
      {
        title: "Weather Overlay",
        url: "/geospatial/weather",
        icon: CloudRain,
      },
      {
        title: "Resource Distribution",
        url: "/geospatial/resources",
        icon: Network,
      },
      {
        title: "Site Analysis",
        url: "/geospatial/analysis",
        icon: Maximize2,
      },
    ],
  },
  {
    title: "Power Intelligence",
    url: "/power",
    icon: Zap,
    items: [
      {
        title: "Generation Control",
        url: "/power/control",
        icon: Power,
      },
      {
        title: "Production Forecast",
        url: "/power/forecast",
        icon: LineChart,
      },
      {
        title: "Grid Integration",
        url: "/power/grid",
        icon: Network,
      },
      {
        title: "Energy Trading",
        url: "/power/trading",
        icon: Binary,
      },
    ],
  },
  {
    title: "Asset Performance",
    url: "/performance",
    icon: Gauge,
    items: [
      {
        title: "Reliability Metrics",
        url: "/performance/reliability",
        icon: Timer,
      },
      {
        title: "Availability Analysis",
        url: "/performance/availability",
        icon: Percent,
      },
      {
        title: "Efficiency Tracking",
        url: "/performance/efficiency",
        icon: Activity,
      },
      {
        title: "Maintenance Impact",
        url: "/performance/maintenance",
        icon: Workflow,
      },
    ],
  },
  {
    title: "Environmental Intel",
    url: "/environmental",
    icon: CloudLightning,
    items: [
      {
        title: "Weather Forecasting",
        url: "/environmental/forecast",
        icon: CloudRain,
      },
      {
        title: "Resource Assessment",
        url: "/environmental/resources",
        icon: Gauge,
      },
      {
        title: "Impact Analysis",
        url: "/environmental/impact",
        icon: Leaf,
      },
      {
        title: "Condition Monitoring",
        url: "/environmental/conditions",
        icon: Thermometer,
      },
    ],
  },
  {
    title: "Smart Alerts",
    url: "/alerts",
    icon: Bell,
    items: [
      {
        title: "Alert Configuration",
        url: "/alerts/config",
        icon: Settings2,
      },
      {
        title: "Notification Rules",
        url: "/alerts/rules",
        icon: Radio,
      },
      {
        title: "Event History",
        url: "/alerts/history",
        icon: Clock,
      },
      {
        title: "Response Automation",
        url: "/alerts/automation",
        icon: Cpu,
      },
    ],
  },
  {
    title: "Asset Management",
    url: "/assets",
    icon: Database,
    items: [
      {
        title: "Wind Fleet",
        url: "/assets/wind",
        icon: Wind,
      },
      {
        title: "Solar Portfolio",
        url: "/assets/solar",
        icon: Sun,
      },
      {
        title: "Storage Systems",
        url: "/assets/storage",
        icon: Battery,
      },
      {
        title: "Hybrid Plants",
        url: "/assets/hybrid",
        icon: Zap,
      },
    ],
  },
  {
    title: "Enterprise",
    url: "/enterprise",
    icon: Building2,
    items: [
      {
        title: "Team Management",
        url: "/enterprise/teams",
        icon: Users,
      },
      {
        title: "Access Control",
        url: "/enterprise/access",
        icon: ShieldCheck,
      },
      {
        title: "System Logs",
        url: "/enterprise/logs",
        icon: FileText,
      },
      {
        title: "Integrations",
        url: "/enterprise/integrations",
        icon: Share2,
      },
    ],
  },
]


const navSecondaryData = [
  {
    title: "Documentation",
    url: "/docs",
    icon: BookOpen,
  },
  {
    title: "Security Center",
    url: "/security",
    icon: ShieldCheck,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { tenantPath } = useTenant()

  if (!user) return null

  const mainItems = React.useMemo(() => (
    navMainData.map(item => ({
      ...item,
      url: tenantPath(item.url),
      items: item.items?.map(sub => ({ ...sub, url: tenantPath(sub.url) }))
    }))
  ), [tenantPath])

  const secondaryItems = React.useMemo(() => (
    navSecondaryData.map(item => ({ ...item, url: tenantPath(item.url) }))
  ), [tenantPath])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Firmaboard</span>
                  <span className="truncate text-xs">Enterprise Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          company: user.company
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}

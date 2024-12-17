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

const data = {
  user: {
    name: "example",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
  navSecondary: [
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

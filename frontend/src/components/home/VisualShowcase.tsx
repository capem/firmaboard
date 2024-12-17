import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChartBarIcon,
  TableCellsIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  CloudIcon,
  BoltIcon,
  CircleStackIcon,
  CpuChipIcon,
  ClockIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { PlaceholderDashboard } from '@/components/ui/placeholder-dashboard';

interface Stat {
  label: string;
  value: string;
}

interface EnhancedStat extends Stat {
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

interface DemoTab {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  variant: 'analytics' | 'fleet' | 'geospatial';
  stats?: EnhancedStat[];
}


const DEMO_TABS: DemoTab[] = [
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    icon: ChartBarIcon,
    variant: 'analytics',
    description: 'Real-time performance analytics with advanced forecasting and anomaly detection capabilities.',
    stats: [
      {
        label: 'Data Points',
        value: '1M',
        suffix: '/Day',
        highlight: true,
        icon: <CircleStackIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Prediction Accuracy',
        value: '99.9',
        suffix: '%',
        icon: <CpuChipIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Response Time',
        value: '100',
        prefix: '<',
        suffix: 'ms',
        highlight: true,
        icon: <ClockIcon className="w-4 h-4 text-primary" />
      }
    ]
  },
  {
    id: 'fleet',
    title: 'Fleet Management',
    icon: TableCellsIcon,
    variant: 'fleet',
    description: 'Comprehensive fleet overview with detailed asset performance metrics and maintenance scheduling.',
    stats: [
      {
        label: 'Assets Monitored',
        value: '5000',
        suffix: '+',
        highlight: true,
        icon: <ServerStackIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Uptime',
        value: '99.99',
        suffix: '%',
        highlight: true,
        icon: <ShieldCheckIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Cost Savings',
        value: '35',
        suffix: '%',
        icon: <BanknotesIcon className="w-4 h-4 text-primary" />
      }
    ]
  },
  {
    id: 'geospatial',
    title: 'Geospatial Intelligence',
    icon: MapIcon,
    variant: 'geospatial',
    description: 'Interactive GIS visualization with weather overlay and asset performance correlation.',
    stats: [
      {
        label: 'Coverage',
        value: '100',
        suffix: '+ Countries',
        highlight: true,
        icon: <GlobeAltIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Data Sources',
        value: '25',
        suffix: '+ Providers',
        icon: <CloudIcon className="w-4 h-4 text-primary" />
      },
      {
        label: 'Refresh Rate',
        value: '300',
        suffix: 'ms',
        highlight: true,
        icon: <BoltIcon className="w-4 h-4 text-primary" />
      }
    ]
  }
];

const StatBadge: React.FC<{ stat: EnhancedStat }> = ({ stat }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className={cn(
      "relative px-4 py-3 rounded-xl",
      "bg-gradient-to-br",
      stat.highlight
        ? "from-primary/10 via-primary/5 to-primary/10"
        : "from-primary/5 via-transparent to-primary/5",
      "border border-primary/10",
      "hover:border-primary/20",
      "transition-all duration-300 ease-in-out",
      "group cursor-pointer overflow-hidden"
    )}
  >
    <div
      className={cn(
        "absolute inset-0",
        "bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0",
        "opacity-0 group-hover:opacity-100",
        "transition-opacity duration-500 ease-in-out",
        "-z-10"
      )}
    />

    <div className="relative flex flex-col items-center text-center gap-1">
      {stat.icon && (
        <div className={cn(
          "mb-1",
          "transform group-hover:scale-110",
          "transition-transform duration-300 ease-out"
        )}>
          {stat.icon}
        </div>
      )}
      <div className="flex items-center gap-1 justify-center">
        {stat.prefix && (
          <span className="text-sm text-primary/70">{stat.prefix}</span>
        )}
        <span className={cn(
          "text-lg font-bold",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-primary to-primary/70",
          "group-hover:from-primary group-hover:to-primary",
          "transition-all duration-300 ease-in-out"
        )}>
          {stat.value}
        </span>
        {stat.suffix && (
          <span className="text-sm text-primary/70">{stat.suffix}</span>
        )}
      </div>
      <span className={cn(
        "text-xs font-medium",
        "text-muted-foreground/80",
        "group-hover:text-muted-foreground",
        "transition-colors duration-300 ease-in-out"
      )}>
        {stat.label}
      </span>
    </div>
  </motion.div>
);

const VisualShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<DemoTab['id']>('analytics');

  return (
    <section className={cn(
      "w-full py-24 relative overflow-hidden",
      "bg-muted/95"
    )}>
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/40" />
      </div>

      <div className="container relative">
        <div className="flex flex-col gap-16">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Experience the Future of Renewable Operations
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore our intelligent dashboards designed for next-generation utility-scale management
              </p>
            </div>
          </motion.div>

          <Tabs
            defaultValue="analytics"
            className="w-full max-w-5xl mx-auto"
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {DEMO_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary/10"
                >
                  <tab.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {DEMO_TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col items-center gap-6">
                        <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                          {tab.description}
                        </p>
                        {tab.stats && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
                            {tab.stats.map((stat) => (
                              <StatBadge
                                key={stat.label}
                                stat={stat}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-1">
                      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-sm">
                        <PlaceholderDashboard
                          variant={tab.variant}
                          className="w-full h-full transition-all duration-700 hover:scale-105"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className={cn(
              "max-w-md",
              "bg-muted/50 backdrop-blur-sm",
              "border-primary/10",
              "hover:border-primary/20 hover:shadow-lg",
              "transition-all duration-300"
            )}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Ready to see how our platform can transform your operations?
                    Schedule a personalized consultation with our solutions architects
                    for a deep-dive technical demonstration.
                  </p>
                  <Button
                    variant="default"
                    className={cn(
                      "group",
                      "bg-primary/90 hover:bg-primary",
                      "transition-all duration-300"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      Schedule Technical Demo
                      <ArrowTopRightOnSquareIcon
                        className={cn(
                          "w-4 h-4",
                          "group-hover:translate-x-1 group-hover:-translate-y-1",
                          "transition-transform duration-300"
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
import * as React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ServerStackIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  CloudArrowUpIcon,
  BoltIcon,
  CircleStackIcon,
  CommandLineIcon,
  CpuChipIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  category: 'platform' | 'enterprise';
}

const features: Feature[] = [
  // Platform Features
  {
    title: 'Asset Management',
    description: 'Comprehensive renewable asset lifecycle management with predictive maintenance and performance optimization.',
    icon: CircleStackIcon,
    badge: 'Core Platform',
    category: 'platform'
  },
  {
    title: 'Performance Analytics',
    description: 'AI-powered analytics engine for real-time monitoring, forecasting, and sophisticated power curve analysis.',
    icon: ChartBarIcon,
    badge: 'Real-Time AI',
    category: 'platform'
  },
  {
    title: 'Smart Monitoring',
    description: 'Sub-second performance monitoring with automated anomaly detection and predictive maintenance alerts.',
    icon: SignalIcon,
    badge: 'Predictive',
    category: 'platform'
  },
  {
    title: 'Workflow Automation',
    description: 'Intelligent workflow orchestration with automated dispatch and resource optimization.',
    icon: CogIcon,
    badge: 'AI-Powered',
    category: 'platform'
  },
  {
    title: 'Fleet Optimization',
    description: 'Dynamic fleet-wide performance benchmarking and automated curtailment optimization.',
    icon: ArrowPathIcon,
    badge: 'Fleet-Wide',
    category: 'platform'
  },
  {
    title: 'Advanced Reporting',
    description: 'Customizable reporting suite with automated compliance documentation and ESG metrics.',
    icon: DocumentChartBarIcon,
    badge: 'Automated',
    category: 'platform'
  },

  // Enterprise Features
  {
    title: 'Enterprise Integration',
    description: 'Seamless integration with SCADA, EMS, DERMS, and CMMS systems with multi-protocol support.',
    icon: ServerStackIcon,
    badge: 'Multi-Protocol',
    category: 'enterprise'
  },
  {
    title: 'Security Framework',
    description: 'ISO 27001 certified security with air-gapped deployment options and comprehensive RBAC.',
    icon: ShieldCheckIcon,
    badge: 'ISO 27001',
    category: 'enterprise'
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Enterprise-grade cloud infrastructure with 99.99% uptime SLA and global availability.',
    icon: CloudArrowUpIcon,
    badge: '99.99% Uptime',
    category: 'enterprise'
  },
  {
    title: 'High Performance',
    description: 'Distributed computing architecture optimized for processing millions of data points per second.',
    icon: BoltIcon,
    badge: 'Ultra-Fast',
    category: 'enterprise'
  },
  {
    title: 'Data Management',
    description: 'Advanced data warehousing with automated backup and disaster recovery systems.',
    icon: CpuChipIcon,
    badge: 'Enterprise Data',
    category: 'enterprise'
  },
  {
    title: 'API Integration',
    description: 'Comprehensive REST APIs with enterprise-grade rate limiting and monitoring.',
    icon: CommandLineIcon,
    badge: 'REST API',
    category: 'enterprise'
  },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className={cn(
        "h-full transition-all duration-300",
        "hover:shadow-lg hover:border-primary/20",
        "group relative overflow-hidden"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
          "transition-opacity duration-300"
        )} />

        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                "bg-primary/5 text-primary",
                "transition-colors duration-300",
                "group-hover:bg-primary/10"
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-xl leading-none pt-1">
                  {feature.title}
                </h3>
                {feature.badge && (
                  <Badge variant="secondary" className={cn(
                    "bg-secondary/30 text-secondary-foreground/90",
                    "group-hover:bg-secondary/40",
                    "transition-colors duration-300",
                    "text-xs font-medium",
                    "px-2 py-0.5",
                    "rounded-md"
                  )}>
                    {feature.badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <p className={cn(
            "text-muted-foreground leading-relaxed",
            "group-hover:text-foreground/90",
            "transition-colors duration-300"
          )}>
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<'platform' | 'enterprise'>('platform');

  return (
    <section className={cn(
      "w-full py-24 relative overflow-hidden",
      "bg-muted/30"
    )}>
      <div className="absolute inset-0 opacity-15 bg-[url('/grid-pattern.svg')] bg-repeat" />
      <div className="container relative">
        <div className="flex flex-col gap-16">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Enterprise-Grade Platform
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Purpose-built features designed for utility-scale renewable operations,
                enabling sophisticated fleet management and performance optimization
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant={activeCategory === 'platform' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('platform')}
                className="min-w-[140px]"
              >
                Platform
              </Button>
              <Button
                variant={activeCategory === 'enterprise' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('enterprise')}
                className="min-w-[140px]"
              >
                Enterprise
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {features
              .filter(feature => feature.category === activeCategory)
              .map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
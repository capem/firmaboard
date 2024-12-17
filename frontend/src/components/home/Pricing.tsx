import * as React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface PricingFeature {
  name: string;
  tooltip?: string;
  highlight?: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  capacity: string;
  features: PricingFeature[];
  isPopular: boolean;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Professional',
    description: 'For growing renewable portfolios',
    price: 'Starting at $_,___/month',
    capacity: 'Up to 500MW',
    features: [
      { name: 'Real-time performance monitoring', highlight: true },
      { name: 'Basic SCADA integration', tooltip: 'Support for standard protocols including Modbus and DNP3' },
      { name: 'Standard reporting suite' },
      { name: 'Email & phone support' },
      { name: 'Cloud deployment' },
      { name: '30-day data retention' },
    ],
    isPopular: false,
    badge: 'Most Flexible'
  },
  {
    name: 'Enterprise',
    description: 'For utility-scale operations',
    price: 'Starting at $_,___/month',
    capacity: 'Up to 2GW',
    features: [
      { name: 'Advanced analytics engine', tooltip: 'Including predictive maintenance and performance optimization', highlight: true },
      { name: 'Full SCADA & DERMS integration', tooltip: 'Support for all major protocols and custom integrations' },
      { name: 'Custom reporting & analytics' },
      { name: 'Dedicated success manager' },
      { name: 'Cloud or on-premise deployment' },
      { name: '365-day data retention' },
      { name: 'API access' },
      { name: 'SSO & advanced security' },
    ],
    isPopular: true,
    badge: 'Most Popular'
  },
  {
    name: 'Global IPP',
    description: 'For multi-GW portfolios',
    price: 'Custom pricing',
    capacity: 'Unlimited capacity',
    features: [
      { name: 'Enterprise features plus:', highlight: true },
      { name: 'Multi-region deployment', tooltip: 'Support for geographical data sovereignty requirements' },
      { name: 'Custom data retention policies' },
      { name: 'Advanced compliance features', tooltip: 'Including NERC-CIP compliance support' },
      { name: 'Custom SLA guarantees' },
      { name: '24/7 dedicated support' },
      { name: 'Custom integration services' },
      { name: 'Unlimited API access' },
    ],
    isPopular: false,
    badge: 'Most Comprehensive'
  },
];

const PricingCard: React.FC<{ plan: PricingPlan; index: number }> = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className={cn(
        "relative flex flex-col h-full transition-all duration-300",
        "group hover:shadow-lg",
        plan.isPopular && "border-primary shadow-lg scale-105",
        !plan.isPopular && "hover:border-primary/50"
      )}>
        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
          "transition-opacity duration-300"
        )} />

        {plan.badge && (
          <span className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2",
            "px-3 py-1 rounded-full shadow-sm",
            "text-sm font-medium",
            "flex items-center gap-1.5",
            plan.isPopular ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}>
            {plan.badge}
          </span>
        )}

        <CardHeader className="space-y-2 relative">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          <div className="space-y-1 pt-4">
            <p className="text-3xl font-bold">{plan.price}</p>
            <p className="text-sm text-muted-foreground">{plan.capacity}</p>
          </div>
        </CardHeader>

        <CardContent className="flex-grow relative">
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-2">
                <Check className={cn(
                  "h-4 w-4 flex-shrink-0 mt-1",
                  feature.highlight ? "text-primary" : "text-muted-foreground/70"
                )} />
                <span className={cn(
                  "text-sm flex items-center gap-1.5",
                  feature.highlight ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {feature.name}
                  {feature.tooltip && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-56">{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="relative">
          <Button 
            variant={plan.isPopular ? 'default' : 'outline'} 
            className="w-full group/button"
          >
            <span className="flex items-center justify-center gap-2">
              {plan.name === 'Global IPP' ? 'Contact Sales' : 'Schedule Demo'}
              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Pricing: React.FC = () => {
  return (
    <section className={cn(
      "w-full py-24 relative z-0 overflow-hidden",
      "bg-background"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/80 to-muted/20" />

      <div className="container relative">
        <div className="flex flex-col gap-16">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Enterprise-Grade Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Scalable pricing for renewable operations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <TooltipProvider>
              {pricingPlans.map((plan, index) => (
                <PricingCard 
                  key={plan.name} 
                  plan={plan} 
                  index={index}
                />
              ))}
            </TooltipProvider>
          </div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Custom enterprise plans available for specific requirements
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
import * as React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { QuoteIcon, Building2Icon, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  feedback: string;
  portfolio: string;
  focus: string;
  logoUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Operations Director',
    company: 'NextGen Renewables',
    portfolio: '5GW Portfolio',
    focus: 'Solar & Storage',
    feedback: "The performance analytics and predictive maintenance features have helped us reduce downtime by 30%. The automated alerts and AI-powered anomaly detection are particularly valuable for managing our distributed assets.",
    logoUrl: '/images/company-logos/nextgen.svg'
  },
  {
    name: 'Michael Richardson',
    role: 'Technical Manager',
    company: 'Global Wind Partners',
    portfolio: '3.5GW Portfolio',
    focus: 'Wind Assets',
    feedback: "What stands out is the platform's ability to handle massive data streams from our SCADA systems. The automated reporting and compliance documentation features save our team countless hours each month.",
    logoUrl: '/images/company-logos/gwp.svg'
  },
  {
    name: 'Elizabeth Martinez',
    role: 'Asset Manager',
    company: 'SunGrid Utilities',
    portfolio: '4GW Portfolio',
    focus: 'Hybrid Plants',
    feedback: "The workflow automation and fleet optimization tools have transformed our maintenance operations. Being able to benchmark performance across our entire fleet and optimize curtailment strategies has been game-changing.",
    logoUrl: '/images/company-logos/sungrid.svg'
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
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

        <CardHeader className="relative space-y-4">
          <div className="flex items-center justify-between">
            <QuoteIcon className={cn(
              "h-8 w-8",
              "text-primary opacity-80",
              "transition-colors duration-300",
              "group-hover:opacity-100"
            )} />
            {testimonial.logoUrl ? (
              <img
                src={testimonial.logoUrl}
                alt={testimonial.company}
                className={cn(
                  "h-8 opacity-70",
                  "transition-opacity duration-300",
                  "group-hover:opacity-100"
                )}
              />
            ) : (
              <Building2Icon className="h-6 w-6 text-muted-foreground/50" />
            )}
          </div>
          <blockquote className={cn(
            "relative",
            "text-muted-foreground",
            "group-hover:text-foreground/90",
            "transition-colors duration-300",
            "[&>p]:relative [&>p]:z-10",
            'before:content-["\\""] before:absolute before:left-0 before:top-0 before:-translate-x-2 before:-translate-y-3',
            "before:text-4xl before:font-serif before:text-primary before:opacity-80",
            "before:transition-opacity before:duration-300",
            "group-hover:before:opacity-100"
          )}>
            <p>{testimonial.feedback}</p>
          </blockquote>
        </CardHeader>

        <CardContent className="relative">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={cn(
              "bg-primary/10 text-primary",
              "group-hover:bg-primary/20",
              "transition-colors duration-300"
            )}>
              {testimonial.portfolio}
            </Badge>
            <Badge variant="outline" className={cn(
              "group-hover:bg-accent",
              "transition-colors duration-300"
            )}>
              {testimonial.focus}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className={cn(
          "relative flex flex-col items-start gap-2",
          "border-t pt-4"
        )}>
          <div className="flex items-center gap-2">
            <Gem className={cn(
              "h-4 w-4",
              "text-primary/70",
              "group-hover:text-primary/90",
              "transition-colors duration-300"
            )} />
            <h4 className="font-semibold">{testimonial.name}</h4>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{testimonial.role}</p>
            <p>{testimonial.company}</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className={cn(
      "w-full py-24 relative overflow-hidden",
      "bg-muted/30"
    )}>
      <div className="absolute inset-0 opacity-15 bg-[url('/grid-pattern.svg')] bg-repeat" />
      <div className="container relative">
        <div className="flex flex-col gap-16">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Powering operations for leading utilities and independent power producers worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2Icon className="h-4 w-4" />
              <span>Serving 50+ enterprise clients across 4 continents</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
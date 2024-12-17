import * as React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatProps {
  value: string;
  label: string;
}

const Stat: React.FC<StatProps> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-sm text-muted">{label}</span>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-primary text-primary-foreground overflow-hidden">
      <div className="container relative py-24">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8 text-center max-w-4xl mx-auto relative"
        >
          {/* Split headline with enhanced typography */}
          <div className="space-y-4">
            <h1 className={cn(
              "text-4xl sm:text-6xl font-bold tracking-tight",
              "bg-clip-text"
            )}>
              <span className="block">Unlock Enterprise-Grade</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-green-200 leading-tight pb-1">
                Renewable Intelligence
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
              Empowering utility-scale operators with advanced analytics through
              seamless SCADA integration. Optimize performance, predict maintenance,
              and drive sustainability—all in real-time.
            </p>
          </div>

          {/* Enhanced CTA section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              size="lg"
              variant="secondary"
              className={cn(
                "font-semibold relative overflow-hidden",
                "transition-all hover:shadow-lg group"
              )}
            >
              <span className="flex items-center gap-2">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "font-semibold bg-transparent",
                "border-muted hover:bg-muted group"
              )}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                View Live Demo
              </span>
            </Button>
          </div>

          {/* Stats section */}
          <div className={cn(
            "grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 p-6",
            "rounded-lg bg-muted/10 backdrop-blur-sm",
            "border border-muted"
          )}>
            <Stat value="50GW+" label="Renewable Capacity" />
            <Stat value="99.9%" label="Platform Uptime" />
            <Stat value="24/7" label="Real-time Monitoring" />
          </div>

          {/* Trust indicator */}
          <div className="flex items-center gap-2 text-sm text-muted">
            <Zap className="w-4 h-4" />
            <span>Trusted by leading IPPs and utilities worldwide</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

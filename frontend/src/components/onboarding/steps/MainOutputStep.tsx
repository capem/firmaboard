import * as React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Zap, Cog, LineChart, Sparkles } from 'lucide-react';

interface MainOutputStepProps {
  selectedOutput: string;
  setSelectedOutput: (output: string) => void;
}

const outputs = [
  {
    id: 'energy-generation',
    title: 'Increase Energy Generation',
    icon: Zap,
    description: 'Optimize plant performance and boost energy yield through AI-driven insights',
    benefit: 'Average 12-15% increase in annual generation'
  },
  {
    id: 'asset-management',
    title: 'Automate Asset Management',
    icon: Cog,
    description: 'Streamline operations with predictive maintenance and automated workflows',
    benefit: 'Reduce O&M costs by up to 25%'
  },
  {
    id: 'operational-efficiency',
    title: 'Increase Operational Efficiency',
    icon: LineChart,
    description: 'Enhance decision-making with real-time analytics and performance metrics',
    benefit: 'Improve operational efficiency by 30%'
  },
  {
    id: 'explore',
    title: "Not sure yet. I'm open!",
    icon: Sparkles,
    description: 'Explore how our platform can be tailored to your specific needs',
    benefit: 'Get a personalized solution recommendation'
  }
] as const;

const MainOutputStep = ({ selectedOutput, setSelectedOutput }: MainOutputStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">What's your primary goal?</h2>
        <p className="text-muted-foreground">
          Select the outcome that best aligns with your renewable energy objectives.
        </p>
      </div>

      <RadioGroup 
        value={selectedOutput} 
        onValueChange={setSelectedOutput}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 my-8"
      >
        {outputs.map((output) => {
          const Icon = output.icon;
          const isSelected = selectedOutput === output.title;

          return (
            <motion.div
              key={output.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Label
                htmlFor={output.id}
                className={cn(
                  "relative flex flex-col h-full p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5 shadow-sm",
                  !isSelected && "border-muted"
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium leading-none">{output.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {output.description}
                    </p>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm font-medium text-primary"
                      >
                        {output.benefit}
                      </motion.div>
                    )}
                  </div>
                </div>
                <RadioGroupItem
                  id={output.id}
                  value={output.title}
                  className="sr-only"
                />
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground text-center">
          Join 500+ renewable energy companies already optimizing their operations
        </p>
      </div>
    </div>
  );
};

export default MainOutputStep; 
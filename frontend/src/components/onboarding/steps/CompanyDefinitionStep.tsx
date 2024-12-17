import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Building2, Wrench, Coins } from 'lucide-react';

interface CompanyDefinitionStepProps {
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const options = [
  {
    id: 'asset-owner',
    label: 'Asset Owner/Manager',
    description: 'IPPs, Developers',
    icon: Building2
  },
  {
    id: 'asset-operator',
    label: 'Asset Operator',
    description: 'Operations and Maintenance teams',
    icon: Wrench
  },
  {
    id: 'financial-investor',
    label: 'Financial Investor',
    description: 'Lenders, Banks, Investors, Funds',
    icon: Coins
  },
] as const;

const CompanyDefinitionStep = ({ selectedOptions, setSelectedOptions }: CompanyDefinitionStepProps) => {
  const handleChange = (label: string) => {
    if (selectedOptions.includes(label)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== label));
    } else {
      setSelectedOptions([...selectedOptions, label]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">What best defines your company?</h2>
        <p className="text-muted-foreground">
          Feel free to choose more than one category, if applicable.
        </p>
      </div>

      <div className="grid gap-4 flex-1 my-8">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOptions.includes(option.label);

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={cn(
                  "relative flex items-start space-x-4 rounded-lg border-2 p-6 cursor-pointer transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5 shadow-sm",
                  !isSelected && "border-muted"
                )}
                onClick={() => handleChange(option.label)}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <Label 
                      htmlFor={option.id}
                      className="font-medium leading-none cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <Checkbox
                      id={option.id}
                      checked={isSelected}
                      onCheckedChange={() => handleChange(option.label)}
                      className="ml-auto"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground text-center">
          Your selection helps us tailor the platform to your specific needs
        </p>
      </div>
    </div>
  );
};

export default CompanyDefinitionStep; 
import * as React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  Database, 
  Upload, 
  Shield, 
  Check,
  FileJson,
  FileSpreadsheet,
  Wifi
} from 'lucide-react';

interface DataConnectionStepProps {
  selectedConnection: string;
  setSelectedConnection: (connection: string) => void;
}

const connections = [
  {
    id: 'live-data',
    title: 'Connect Live Plant Data',
    icon: Database,
    description: 'Real-time connection to your SCADA, DCS, or historian systems',
    features: [
      { icon: Wifi, text: 'Secure API integration' },
      { icon: Shield, text: 'End-to-end encryption' },
      { icon: Check, text: '99.9% uptime SLA' }
    ]
  },
  {
    id: 'file-upload',
    title: 'Upload Files',
    icon: Upload,
    description: 'Upload historical data files for analysis',
    features: [
      { icon: FileJson, text: 'Support for CSV, JSON, XML' },
      { icon: FileSpreadsheet, text: 'Excel workbook support' },
      { icon: Shield, text: 'Automated data validation' }
    ]
  }
] as const;

const DataConnectionStep = ({ selectedConnection, setSelectedConnection }: DataConnectionStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Connect Your Data</h2>
        <p className="text-muted-foreground">
          Choose how you'd like to connect your renewable energy data to our platform.
        </p>
      </div>

      <RadioGroup 
        value={selectedConnection} 
        onValueChange={setSelectedConnection}
        className="grid gap-4 flex-1 my-8"
      >
        {connections.map((connection) => {
          const isSelected = selectedConnection === connection.title;

          return (
            <motion.div
              key={connection.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <Label
                htmlFor={connection.id}
                className={cn(
                  "relative block p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5 shadow-sm",
                  !isSelected && "border-muted"
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <connection.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium leading-none">{connection.title}</h3>
                      <RadioGroupItem
                        id={connection.id}
                        value={connection.title}
                        className="sr-only"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {connection.description}
                    </p>

                    <motion.div 
                      initial={false}
                      animate={{ height: isSelected ? 'auto' : 0 }}
                      className="overflow-hidden"
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {connection.features.map((feature, index) => (
                              <div 
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <feature.icon className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature.text}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Your data is protected by enterprise-grade security measures</span>
        </div>
      </div>
    </div>
  );
};

export default DataConnectionStep; 
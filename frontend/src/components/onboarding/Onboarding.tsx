import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CompanyDefinitionStep from './steps/CompanyDefinitionStep';
import MainOutputStep from './steps/MainOutputStep';
import DataConnectionStep from './steps/DataConnectionStep';
import { ArrowRight, ArrowLeft, Shield, Zap, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/hooks/use-onboarding';

const steps = [
  {
    icon: Building2,
    title: "Company Profile",
    description: "Quick registration & company details",
  },
  {
    icon: Zap,
    title: "Output Goals",
    description: "Define your energy objectives",
  },
  {
    icon: Shield,
    title: "Data Integration",
    description: "Secure connection setup",
  }
] as const;

const Onboarding = () => {
  const {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleBack,
    handleSubmit,
  } = useOnboarding();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 px-4 py-8 md:py-12">
      <div className="container max-w-4xl">
        <div className="space-y-6 md:space-y-8">
          {/* Progress Steps */}
          <nav
            aria-label="Progress Steps"
            className="relative mx-auto max-w-2xl"
          >
            <div className="flex justify-between relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: currentStep === index + 1 ? 1.1 : 1,
                      opacity: currentStep >= index + 1 ? 1 : 0.7
                    }}
                    whileHover={{ scale: currentStep >= index + 1 ? 1.15 : 1 }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 md:h-12 md:w-12",
                      "ring-offset-background cursor-pointer",
                      currentStep === index + 1 && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                      currentStep > index + 1 && "bg-primary/80 text-primary-foreground",
                      currentStep < index + 1 && "bg-muted text-muted-foreground"
                    )}
                  >
                    <step.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </motion.div>
                  <div className="mt-2 text-center md:mt-3">
                    <p className="text-xs font-medium md:text-sm">{step.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
              {/* Progress Bar */}
              <div
                className="absolute top-5 left-0 h-0.5 w-full bg-muted -z-10 md:top-6"
                aria-hidden="true"
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <Card className="relative overflow-hidden border-muted/30 shadow-lg">
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                opacity: [0.5, 0.8]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="relative h-[450px] md:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {currentStep === 1 && (
                      <CompanyDefinitionStep
                        formData={formData}
                        setFormData={setFormData}
                        selectedOptions={formData.companyDefinitions}
                        setSelectedOptions={(options) =>
                          setFormData({ ...formData, companyDefinitions: options })
                        }
                      />
                    )}
                    {currentStep === 2 && (
                      <MainOutputStep
                        selectedOutput={formData.mainOutput}
                        setSelectedOutput={(output) =>
                          setFormData({ ...formData, mainOutput: output })
                        }
                      />
                    )}
                    {currentStep === 3 && (
                      <DataConnectionStep
                        selectedConnection={formData.dataConnection}
                        setSelectedConnection={(connection) =>
                          setFormData({ ...formData, dataConnection: connection })
                        }
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t bg-card/50 p-4 backdrop-blur-sm md:p-6 lg:p-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className={cn(
                    "transition-all duration-200",
                    currentStep > 1 ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>

              {currentStep < 3 ? (
                <Button onClick={handleNext} className="group ml-auto">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  className="group ml-auto bg-gradient-to-r from-primary to-primary/90 hover:to-primary"
                >
                  Launch Dashboard
                  <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Trust Signals */}
          <footer className="text-center space-y-4">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Shield className="h-4 w-4 text-primary" />
              <span>Enterprise-grade security | ISO 27001 certified | SOC 2 Type II compliant</span>
            </motion.div>

            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Trusted by leading renewable energy companies worldwide
            </motion.div>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Onboarding; 
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OnboardingData } from '@/types/onboarding';
import { 
  AtSign, 
  Building2, 
  KeyRound, 
  Sparkles, 
  Phone, 
  MapPin, 
  UserCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface CompanyDefinitionStepProps {
  formData: OnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const companyTypes = [
  { id: 'solar', label: 'Solar Energy Assets', description: 'Photovoltaic systems & solar solutions' },
  { id: 'wind', label: 'Wind Power Assets', description: 'Onshore & offshore wind energy' },
  { id: 'storage', label: 'Energy Storage', description: 'Advanced storage solutions' },
  { id: 'hybrid', label: 'Hybrid Assets', description: 'Combined renewable energy & storage systems' },
];

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'employee', label: 'Employee' },
];

const getPasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) score += 20;
  if (password.match(/[A-Z]/)) score += 20;
  if (password.match(/[a-z]/)) score += 20;
  if (password.match(/[0-9]/)) score += 20;
  if (password.match(/[^A-Za-z0-9]/)) score += 20;

  if (score === 100) feedback = 'Excellent - Enterprise-grade security';
  else if (score >= 80) feedback = 'Strong - Good security practices';
  else if (score >= 60) feedback = 'Moderate - Could be stronger';
  else if (score >= 40) feedback = 'Weak - Add more variety';
  else feedback = 'Very weak - Enhance security';

  return { score, feedback };
};

const getStrengthColor = (score: number): string => {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  return 'bg-destructive';
};

const PasswordRequirement = ({ text, met }: { text: string; met: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={cn(
      "h-1.5 w-1.5 rounded-full",
      met ? "bg-success" : "bg-muted-foreground/30"
    )} />
    <span className={cn(
      "text-xs",
      met ? "text-success" : "text-muted-foreground"
    )}>{text}</span>
  </div>
);

const CompanyDefinitionStep: React.FC<CompanyDefinitionStepProps> = ({
  formData,
  setFormData,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string | undefined>>({});
  
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'phoneNumber': {
        const digitsOnly = value.replace(/[^+\d]/g, '');
        if (!digitsOnly.startsWith('+')) {
          return 'Phone number must start with a country code (e.g. +1)';
        }
        if (digitsOnly.length < 11) {
          return 'Phone number must have a country code and at least 10 digits';
        }
        return undefined;
      }
      case 'address':
        return value.trim().length >= 5 ? undefined : 'Please enter a complete address';
      case 'role':
        return roleOptions.some(opt => opt.value === value) ? undefined : 'Please select a valid role';
      case 'companyName':
        return value.trim().length >= 2 ? undefined : 'Company name must be at least 2 characters';
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    const error = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleOptionChange = (id: string) => {
    setSelectedOptions(
      selectedOptions.includes(id)
        ? selectedOptions.filter((item) => item !== id)
        : [...selectedOptions, id]
    );
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /[0-9]/.test(formData.password) },
    { text: "Contains special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent px-1">
      <div className="space-y-4">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Label htmlFor="firstName" className="text-base font-semibold inline-flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-primary" />
                First Name
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  className="pl-9"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                  <UserCircle2 className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative"
            >
              <Label htmlFor="lastName" className="text-base font-semibold inline-flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-primary" />
                Last Name
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  className="pl-9"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                  <UserCircle2 className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Label htmlFor="email" className="text-base font-semibold inline-flex items-center gap-2">
              <AtSign className="h-4 w-4 text-primary" />
              Business Email
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="email"
                id="email"
                placeholder="your@company.com"
                className="pl-9"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                @
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative space-y-3"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base font-semibold inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Secure Password
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Password Requirements:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {passwordRequirements.map((req, index) => (
                          <PasswordRequirement key={index} {...req} />
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative mt-1.5">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a secure password"
                className="pl-9 pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                <KeyRound className="h-4 w-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/50 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Password Strength:</span>
                  <span className={cn(
                    "font-medium",
                    passwordStrength.score >= 80 ? "text-success" : 
                    passwordStrength.score >= 60 ? "text-warning" : 
                    "text-destructive"
                  )}>{passwordStrength.feedback}</span>
                </div>
                <Progress 
                  value={passwordStrength.score} 
                  className={cn(
                    "h-1 transition-all",
                    getStrengthColor(passwordStrength.score)
                  )} 
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Label htmlFor="phone" className="text-base font-semibold inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="tel"
                id="phone"
                placeholder="+1 234 567 8900"
                className={cn(
                  "pl-9",
                  fieldErrors.phoneNumber && "border-destructive focus:ring-destructive/30"
                )}
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                <Phone className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.phoneNumber && (
              <p className="text-sm text-destructive">{fieldErrors.phoneNumber}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Enter your phone number in international format (e.g. +1 234 567 8900)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Label htmlFor="address" className="text-base font-semibold inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Address
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="text"
                id="address"
                placeholder="Enter your complete address"
                className={cn(
                  "pl-9",
                  fieldErrors.address && "border-destructive focus:ring-destructive/30"
                )}
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.address && (
              <p className="text-sm text-destructive">{fieldErrors.address}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Label htmlFor="role" className="text-base font-semibold inline-flex items-center gap-2">
              <UserCircle2 className="h-4 w-4 text-primary" />
              Role
            </Label>
            <div className="relative">
              <Select
                value={formData.role}
                onValueChange={(value) => handleFieldChange('role', value)}
              >
                <SelectTrigger className={cn(
                  fieldErrors.role && "border-destructive focus:ring-destructive/30"
                )}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                <UserCircle2 className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.role && (
              <p className="text-sm text-destructive">{fieldErrors.role}</p>
            )}
          </motion.div>
        </div>

        {/* Company Information Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Company Information</h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Label htmlFor="companyName" className="text-base font-semibold inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Company Name
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="text"
                id="companyName"
                placeholder="Enter your company name"
                className={cn(
                  "pl-9",
                  fieldErrors.companyName && "border-destructive focus:ring-destructive/30"
                )}
                value={formData.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/50">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.companyName && (
              <p className="text-sm text-destructive">{fieldErrors.companyName}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label className="text-base font-semibold inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Energy Expertise
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the areas that best describe your organization
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companyTypes.map(({ id, label, description }, index) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "group relative flex items-start space-x-3 rounded-lg border p-4 transition-all duration-200",
                    selectedOptions.includes(id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => handleOptionChange(id)}
                >
                  <Checkbox
                    id={id}
                    checked={selectedOptions.includes(id)}
                    onCheckedChange={() => handleOptionChange(id)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100"
                    initial={false}
                    animate={selectedOptions.includes(id) ? { opacity: 0.1 } : { opacity: 0 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDefinitionStep; 
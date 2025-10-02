import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api, ENDPOINTS } from '@/config/api';
import { OnboardingData, DataImportTable, ModelSuggestion } from '@/types/onboarding';
import { validateEmail, validatePassword } from '@/utils/auth';
import { storeTokens } from '@/utils/auth';
import { AuthTokens } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

interface UseOnboardingProps {
  initialStep?: number;
  isGoogleOAuth?: boolean;
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  role: string;
  company: {
    name: string;
    registration_number: string;
    address: string;
    contact_email: string;
    contact_phone: string;
    definitions: string[];
    main_output: string;
    data_connection: string;
    stages: OnboardingData['stages'];
  };
}

const validateRegistrationData = (data: OnboardingData, opts?: { isGoogleOAuth?: boolean }): string | undefined => {
  const isGoogleOAuth = opts?.isGoogleOAuth;
  if (!isGoogleOAuth && !data.email) return 'Email is required';
  if (!isGoogleOAuth && !data.password) return 'Password is required';
  if (!data.firstName) return 'First name is required';
  if (!data.lastName) return 'Last name is required';
  if (!data.phoneNumber) return 'Phone number is required';
  if (!data.address) return 'Address is required';
  if (!data.role) return 'Role is required';
  if (!data.companyName) return 'Company name is required';
  
  if (!isGoogleOAuth) {
    const emailError = validateEmail(data.email);
    if (emailError) return emailError;
  } else if (data.email) {
    // If provided in Google flow, validate format but don't require
    const emailError = validateEmail(data.email);
    if (emailError) return emailError;
  }
  
  if (!isGoogleOAuth) {
    const passwordError = validatePassword(data.password);
    if (passwordError) return passwordError;
  }

  const digitsOnly = data.phoneNumber.replace(/[^+\d]/g, '');
  if (!digitsOnly.startsWith('+')) {
    return 'Phone number must start with a country code (e.g. +1)';
  }
  if (digitsOnly.length < 11) {
    return 'Phone number must have a country code and at least 10 digits';
  }

  if (data.address.trim().length < 5) {
    return 'Please enter a complete address';
  }

  const validRoles = ['admin', 'owner', 'manager', 'analyst', 'supervisor', 'employee'];
  if (!validRoles.includes(data.role)) {
    return 'Please select a valid role';
  }

  if (data.companyName.trim().length < 2) {
    return 'Company name must be at least 2 characters';
  }

  return undefined;
};

export const useOnboarding = ({ initialStep = 1, isGoogleOAuth = false }: UseOnboardingProps = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, user, setOnboardingRequired } = useAuth();
  const { tenantPath } = useTenant();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [formData, setFormData] = useState<OnboardingData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    role: '',
    companyName: '',
    companyDefinitions: [],
    mainOutput: '',
    stages: [],
    dataConnection: '',
    dataType: undefined,
    dataFiles: [],
    pendingModelSuggestions: [],
    columnMapping: {},
  });

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const emailError = isGoogleOAuth ? undefined : validateEmail(formData.email);
        const passwordError = isGoogleOAuth ? undefined : validatePassword(formData.password);
        
        // Phone validation
        const digitsOnly = formData.phoneNumber.replace(/[^+\d]/g, '');
        const phoneError = !digitsOnly.startsWith('+') 
          ? 'Phone number must start with a country code (e.g. +1)'
          : digitsOnly.length < 11 
          ? 'Phone number must have a country code and at least 10 digits'
          : undefined;

        const addressError = !formData.address || formData.address.trim().length < 5 ? 'Please enter a complete address' : undefined;
        const roleError = !formData.role ? 'Please select your role' : undefined;
        
        if (emailError || passwordError || phoneError || addressError || roleError || !formData.companyName || !formData.firstName || !formData.lastName) {
          toast({
            title: "Please complete all required fields",
            description: emailError || passwordError || phoneError || addressError || roleError || "All fields marked with * are required",
            variant: "destructive",
          });
          return false;
        }
        return true;
      }
      case 2:
        if (!formData.mainOutput) {
          toast({
            title: "Please select an output goal",
            description: "This helps us customize your dashboard",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.stages || formData.stages.length === 0) {
          toast({
            title: "Please add at least one asset",
            description: "Click 'ADD ASSET' and configure a Windfarm or Solarfarm asset.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        if (!formData.dataConnection) {
          toast({
            title: "Please select a data connection",
            description: "We need this to set up your integrations",
            variant: "destructive",
          });
        }
        if (!formData.dataConnection) return false;
        if (formData.dataConnection === 'file-upload') {
          if (!formData.dataType) {
            toast({
              title: "Select a data type",
              description: "Choose which table to insert your data into.",
              variant: "destructive",
            });
            return false;
          }
          if (!formData.dataFiles || formData.dataFiles.length === 0) {
            toast({
              title: "Add at least one file",
              description: "Please select one or more files to upload.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
      case 5:
        // Column Mapping step: enforce mapping for selected data type when file-upload
        if (formData.dataConnection === 'file-upload') {
          const mapping = formData.columnMapping || {};
          let required: string[] = [];
          if (formData.dataType === 'timeseries_alarm') {
            required = ['turbineId','alarmId','timeOn','timeOff','newTimeOn','alarmCategory'];
          } else if (formData.dataType === 'timeseries_windfarmtimeseries') {
            required = ['time','node_id'];
          } else if (formData.dataType === 'timeseries_solarfarmtimeseries') {
            required = ['time','node_id','solar_irradiance','power_output','module_temperature'];
          }
          if (required.length) {
            const missing = required.filter((k) => !mapping[k]);
            if (missing.length) {
              toast({
                title: "Complete column mapping",
                description: "Please map all required fields before continuing.",
                variant: "destructive",
              });
              return false;
            }
          }
        }
        return true;
      default:
        return false;
    }
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleRegisterAndProceed = async () => {
    if (!validateStep(1)) return;

    try {
      const formattedPhone = formData.phoneNumber.trim().replace(/[^+\d]/g, '');
      const registrationData = {
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: formattedPhone,
        address: formData.address.trim(),
        role: formData.role.trim(),
        company: {
          name: formData.companyName.trim(),
          registration_number: `FB${Date.now()}`,
          address: formData.address.trim(),
          contact_email: formData.email.trim(),
          contact_phone: formattedPhone,
          definitions: formData.companyDefinitions,
          main_output: '', 
          data_connection: '', 
          stages: [], 
        },
      };

      const response = await api.post<RegisterResponse>(ENDPOINTS.auth.register, registrationData);
      
      if (response.data?.tokens) {
        const tokens: AuthTokens = {
          access: response.data.tokens.access,
          refresh: response.data.tokens.refresh
        };
        storeTokens(tokens, true);
        setUser(response.data.user);
        try { sessionStorage.setItem('auth_token', tokens.access); } catch {}
        
        toast({
          title: "Registration Successful",
          description: "Your profile and company have been created.",
        });
        setCurrentStep((prev) => prev + 1);
      } else {
        throw new Error('No authentication tokens received');
      }
    } catch (error: any) {
      console.error('Registration error:', { error, submittedData: formData });
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep === 1 && !isGoogleOAuth) {
      handleRegisterAndProceed();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const formatFinalSubmitData = () => {
    return {
      company: {
        name: formData.companyName.trim(),
        definitions: formData.companyDefinitions,
        main_output: formData.mainOutput,
        data_connection: formData.dataConnection,
        stages: formData.stages,
      },
    };
  };

  const uploadFilesToSelectedTable = async () => {
    if (formData.dataConnection !== 'file-upload' || !formData.dataType || !formData.dataFiles.length) return;
    let success = 0;
    for (const file of formData.dataFiles) {
      const form = new FormData();
      form.append('file', file);
      form.append('target_table', formData.dataType as DataImportTable);
      await api.post(ENDPOINTS.dataImport.uploads, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      success += 1;
    }
    toast({ title: 'Data uploaded', description: `${success} file(s) inserted into ${formData.dataType}.` });
  };

  const persistPendingSuggestions = async (suggestions: ModelSuggestion[]) => {
    if (!suggestions || !suggestions.length) return;
    for (const s of suggestions) {
      try {
        if (s.type === 'solar') {
          await api.post(ENDPOINTS.farms.solarModels, { manufacturer: s.manufacturer, model_name: s.model_name });
        } else {
          await api.post(ENDPOINTS.farms.windModels, { manufacturer: s.manufacturer, model_name: s.model_name });
        }
      } catch (e) {
        // ignore individual failures
      }
    }
  };

  const handleFinalSubmit = async () => {
    // Final validation can be added here if needed
    try {
      // This endpoint needs to be able to update the company with the final details
      // Assuming a PATCH request to the company endpoint
      await api.patch(`${ENDPOINTS.tenants.companies}${user?.company_id}/`, formatFinalSubmitData().company);

      if (formData.dataConnection === 'file-upload') {
        await uploadFilesToSelectedTable();
      }
      
      await persistPendingSuggestions(formData.pendingModelSuggestions);
      setFormData((prev) => ({ ...prev, pendingModelSuggestions: [] }));
      
      setOnboardingRequired(false);

      toast({
        title: "Onboarding Complete",
        description: "Welcome to Firmaboard! Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate(tenantPath('/dashboard'));
      }, 1000);

    } catch (error: any) {
      console.error('Final submission error:', { error, submittedData: formData });
      toast({
        title: "Submission Failed",
        description: "Could not save the final onboarding details.",
        variant: "destructive",
      });
    }
  };

  return {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleBack,
    handleSubmit: handleFinalSubmit, // Keep handleSubmit for simplicity in the component
  };
};
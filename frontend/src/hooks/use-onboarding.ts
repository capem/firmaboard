import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api, ENDPOINTS } from '@/config/api';
import { OnboardingData } from '@/types/onboarding';
import { validateEmail, validatePassword } from '@/utils/auth';
import { storeTokens } from '@/utils/auth';
import { AuthTokens } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

interface UseOnboardingProps {
  initialStep?: number;
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
  };
}

const validateRegistrationData = (data: OnboardingData): string | undefined => {
  if (!data.email) return 'Email is required';
  if (!data.password) return 'Password is required';
  if (!data.firstName) return 'First name is required';
  if (!data.lastName) return 'Last name is required';
  if (!data.phoneNumber) return 'Phone number is required';
  if (!data.address) return 'Address is required';
  if (!data.role) return 'Role is required';
  if (!data.companyName) return 'Company name is required';
  
  const emailError = validateEmail(data.email);
  if (emailError) return emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) return passwordError;

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

export const useOnboarding = ({ initialStep = 1 }: UseOnboardingProps = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
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
    dataConnection: '',
  });

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        
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
        if (!formData.dataConnection) {
          toast({
            title: "Please select a data connection",
            description: "We need this to set up your integrations",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const formatRegistrationData = (): RegisterRequest => {
    // Format the phone number once to ensure consistency
    const formattedPhone = formData.phoneNumber.trim().replace(/[^+\d]/g, '');
    
    return {
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
      },
    };
  };

  const handleSubmit = async () => {
    const validationError = validateRegistrationData(formData);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      const requestData = formatRegistrationData();
      const response = await api.post<RegisterResponse>(ENDPOINTS.auth.register, requestData);
      
      if (response.data?.tokens) {
        // Store the tokens with rememberMe set to true for registration
        const tokens: AuthTokens = {
          access: response.data.tokens.access,
          refresh: response.data.tokens.refresh
        };
        storeTokens(tokens, true);
        
        // Set the user in auth context to complete the login process
        setUser(response.data.user);
        
        toast({
          title: "Registration successful",
          description: "Welcome to Firmaboard! Redirecting to dashboard...",
        });
        
        // Short delay to allow the toast to be seen
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error('No authentication tokens received');
      }
    } catch (error: any) {
      console.error('Registration error:', { error, submittedData: formData });
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      if (errorMessage.includes("already exists")) {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please try logging in instead.",
          variant: "destructive",
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleBack,
    handleSubmit,
  };
}; 
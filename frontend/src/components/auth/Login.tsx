import * as React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wind, ArrowRight, Loader2, AlertCircle, Lock, Mail, Shield } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from "@/components/ui/separator";
import { LoginCredentials, LoginFormErrors } from '@/types/auth';
import { validateEmail, validatePassword } from '@/utils/auth';

const MAX_LOGIN_ATTEMPTS = 5;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState<LoginFormErrors>({});
  const [attempts, setAttempts] = React.useState(0);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleRememberMeChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      setErrors({
        general: 'Too many login attempts. Please try again later or reset your password.',
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData);
      
      if (!result.success && result.error) {
        setAttempts(prev => prev + 1);
        setErrors({ general: result.error.message });
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Marketing Content */}
      <motion.div
        className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

        <Link
          to="/"
          className="relative z-20 flex items-center text-lg font-medium group hover:opacity-90 transition-all duration-300"
        >
          <Wind className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12 duration-300" />
          <span className="text-xl font-bold tracking-tight">Firmaboard</span>
        </Link>

        <motion.div
          className="relative z-20 mt-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div>
            <blockquote className="space-y-4">
              <p className="text-lg font-medium leading-relaxed">
                "Firmaboard has revolutionized how we manage our renewable assets. The insights and control it provides are game-changing for our sustainability goals."
              </p>
              <footer className="text-sm">
                <p className="font-semibold">Sofia Davis</p>
                <p className="opacity-85">Head of Renewable Energy Operations</p>
              </footer>
            </blockquote>
          </div>

          <Separator className="bg-white/20" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-300" />
                <span>ISO 27001 certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-300" />
                <span>SOC 2 Type II compliant</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-300" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-300" />
                <span>End-to-end encryption</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="relative lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-muted/30 shadow-lg backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-muted-foreground/90">
                  Access your renewable energy dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <AnimatePresence mode="wait">
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Alert variant="destructive" className="text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`pl-10 transition-all duration-200 ${errors.email
                          ? 'border-destructive focus:ring-destructive/30'
                          : 'hover:border-primary focus:ring-primary/30'
                          }`}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="email-error"
                        className="text-sm text-destructive"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`pl-10 transition-all duration-200 ${errors.password
                          ? 'border-destructive focus:ring-destructive/30'
                          : 'hover:border-primary focus:ring-primary/30'
                          }`}
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                      />
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="password-error"
                        className="text-sm text-destructive"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={handleRememberMeChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    New to Firmaboard?{' '}
                    <Link to="/onboarding" className="font-medium text-primary hover:underline">
                      Create an account
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          <footer className="text-center space-y-4">
            <motion.p
              className="text-sm text-muted-foreground/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Empowering renewable energy management worldwide
            </motion.p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login; 
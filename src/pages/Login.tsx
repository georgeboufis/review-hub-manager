import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { sanitizeEmail, sanitizeText, checkRateLimit } from '@/lib/security';
import { sanitizeErrorMessage, logSecurityEvent } from '@/lib/errorHandling';
export default function Login() {
  const {
    t
  } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    user
  } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting...');
      navigate('/', {
        replace: true
      });
    }
  }, [user, navigate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const clientId = `auth_${navigator.userAgent.slice(0, 20)}`;
    if (!checkRateLimit(clientId, 5, 300000)) {
      // 5 attempts per 5 minutes
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = sanitizeEmail(formData.email);
      if (!sanitizedEmail) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      if (isLogin) {
        const {
          error
        } = await signIn(sanitizedEmail, formData.password);
        if (error) {
          logSecurityEvent('login_failed', {
            email: sanitizedEmail
          });
          const sanitizedMessage = sanitizeErrorMessage(error);
          toast({
            title: "Login failed",
            description: sanitizedMessage,
            variant: "destructive"
          });
        } else {
          console.log('Login successful');
          logSecurityEvent('login_successful', {
            email: sanitizedEmail
          });
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in."
          });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Sanitize signup data
        const sanitizedFirstName = sanitizeText(formData.firstName);
        const sanitizedLastName = sanitizeText(formData.lastName);
        const sanitizedBusinessName = sanitizeText(formData.businessName);
        const {
          error
        } = await signUp(sanitizedEmail, formData.password, {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          businessName: sanitizedBusinessName
        });
        if (error) {
          logSecurityEvent('signup_failed', {
            email: sanitizedEmail
          });
          const sanitizedMessage = sanitizeErrorMessage(error);
          toast({
            title: "Sign up failed",
            description: sanitizedMessage,
            variant: "destructive"
          });
        } else {
          console.log('Signup successful');
          logSecurityEvent('signup_successful', {
            email: sanitizedEmail
          });
          toast({
            title: "Account created!",
            description: "Welcome! Your account has been created successfully."
          });
        }
      }
    } catch (error) {
      const sanitizedMessage = sanitizeErrorMessage(error);
      toast({
        title: "An error occurred",
        description: sanitizedMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const {
        error
      } = await signInWithGoogle();
      if (error) {
        console.error('Google OAuth error:', error);
        // More specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('unauthorized_client')) {
          errorMessage = "Google OAuth not configured. Please check provider settings.";
        } else if (error.message?.includes('redirect_uri_mismatch')) {
          errorMessage = "Redirect URL mismatch. Please check OAuth configuration.";
        }
        toast({
          title: "Google Sign In Failed",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('Google OAuth initiated successfully');
      }
    } catch (error) {
      console.error('Google OAuth unexpected error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const {
        error
      } = await signInWithApple();
      if (error) {
        console.error('Apple OAuth error:', error);
        // More specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('unauthorized_client')) {
          errorMessage = "Apple OAuth not configured. Please check provider settings.";
        } else if (error.message?.includes('redirect_uri_mismatch')) {
          errorMessage = "Redirect URL mismatch. Please check Apple OAuth configuration.";
        }
        toast({
          title: "Apple Sign In Failed",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('Apple OAuth initiated successfully');
      }
    } catch (error) {
      console.error('Apple OAuth unexpected error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-muted flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Guest Review Manager</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your hospitality reviews in one place</p>
        </div>

        <div className="bg-background rounded-lg shadow-elegant p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {!isLogin && <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                    <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-foreground">Business Name</Label>
                  <Input id="businessName" placeholder="Your Property Business" value={formData.businessName} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" />
                </div>
              </>}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="host@example.com" value={formData.email} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" aria-describedby="email-description" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" aria-describedby="password-description" />
            </div>
            
            {!isLogin && <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} required className="rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 px-3 py-2" />
              </div>}

            <div className="space-y-3 pt-2">
              <Button type="submit" variant="auth" disabled={isLoading} aria-label={isLogin ? 'Sign in to your account' : 'Create new account'} aria-busy={isLoading} className="w-full h-12 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-normal rounded-2xl">
                {isLoading ? <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="ml-2">{isLogin ? 'Signing in…' : 'Creating account…'}</span>
                  </> : <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>}
              </Button>
              <Button type="button" onClick={() => setIsLogin(!isLogin)} variant="auth" aria-label={isLogin ? 'Switch to sign up' : 'Switch to sign in'} className="w-full h-12 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-normal text-center rounded-2xl">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* OAuth Providers */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Button type="button" variant="outline" className="w-full h-12" onClick={handleGoogleSignIn} disabled={isLoading}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <Button type="button" variant="outline" className="w-full h-12" onClick={handleAppleSignIn} disabled={isLoading}>
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continue with Apple
              </Button>
            </div>
          </div>

          {isLogin && <div className="mt-6 text-center">
              <button type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Forgot your password?
              </button>
            </div>}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Trusted by 10,000+ hospitality professionals</p>
        </div>
      </div>
    </div>;
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
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
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
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
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate('/');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          businessName: formData.businessName,
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Guest Review Manager</h1>
          <p className="text-muted-foreground">Manage your hospitality reviews in one place</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      placeholder="Your Property Business" 
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="host@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="professional"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Trusted by 10,000+ hospitality professionals</p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, LockKeyhole, Shield, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg";

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const AdminAuth = () => {
  const { isAuthenticated, isLoading, signIn, verify2FA, requestPasswordReset } = useAdminAuth();
  const [needs2FA, setNeeds2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTab, setFormTab] = useState<'login' | 'forgot-password'>('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [deploymentError, setDeploymentError] = useState<boolean>(false);
  const [checkingDeployment, setCheckingDeployment] = useState<boolean>(true);

  useEffect(() => {
    const checkFunctionDeployment = async () => {
      try {
        setCheckingDeployment(true);
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'ping' },
        }).catch(error => {
          if (error.message?.includes('not found') || error.message?.includes('404')) {
            console.error('Admin auth function not deployed:', error);
            setDeploymentError(true);
          }
          return { error };
        });
      } catch (error) {
        console.error('Function deployment check error:', error);
        setDeploymentError(true);
      } finally {
        setCheckingDeployment(false);
      }
    };

    checkFunctionDeployment();
  }, []);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      console.log(`Attempting to sign in with username: ${data.username}`);
      const result = await signIn(data.username, data.password);
      console.log('Sign in result:', result);
      
      if (result.success && result.requires2FA) {
        setNeeds2FA(true);
      } else if (result.success) {
        const username = result.user?.username || data.username;
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
      } else if (!result.success) {
        setLoginError(result.error || 'Invalid credentials');
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });

        if (result.error?.includes('not available') || result.error?.includes('not deployed')) {
          setDeploymentError(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred');
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const onSubmitTwoFactor = async (data: TwoFactorFormValues) => {
    setIsSubmitting(true);
    
    try {
      await verify2FA(data.code);
    } catch (error) {
      console.error('Two-factor verification error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const onSubmitForgotPassword = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await requestPasswordReset(data.email);
      
      if (!result.success) {
        toast({
          title: "Password reset failed",
          description: result.error || "Unable to process your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="mb-6 flex items-center space-x-2">
        <img 
          src={logoPath}
          alt="Speech Help Logo" 
          className="h-10 w-auto" 
        />
        <div className="text-2xl font-bold text-pink-600">Admin Portal</div>
      </div>
      
      {deploymentError && (
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Deployment Issue Detected</AlertTitle>
          <AlertDescription>
            <div>
              The admin authentication service is not available. The Supabase Edge Function 'admin-auth' needs to be deployed.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {checkingDeployment && (
        <Alert className="mb-4 max-w-md bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Checking authentication service availability...
          </AlertDescription>
        </Alert>
      )}

      
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            {needs2FA 
              ? "Enter the verification code from your authenticator app" 
              : "Sign in to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {needs2FA ? (
            <Form {...twoFactorForm}>
              <form onSubmit={twoFactorForm.handleSubmit(onSubmitTwoFactor)} className="space-y-4">
                <div className="flex justify-center my-6">
                  <Shield className="h-12 w-12 text-pink-600" />
                </div>
                
                <FormField
                  control={twoFactorForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          ) : (
            <Tabs 
              value={formTab} 
              onValueChange={(value) => setFormTab(value as 'login' | 'forgot-password')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="rounded-md text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="forgot-password" className="rounded-md text-sm">Forgot Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                    {loginError && (
                      <Alert className="bg-red-50 border-red-200 mb-4">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {loginError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username or email" 
                              {...field}
                              className="h-10" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                              className="h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="forgot-password" className="mt-0">
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onSubmitForgotPassword)} className="space-y-4">
                    <div className="flex justify-center my-4">
                      <LockKeyhole className="h-8 w-8 text-pink-600" />
                    </div>
                    
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your admin email" 
                              {...field} 
                              className="h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Reset Password"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-gray-500 pt-0">
          <p>Secure access for authorized personnel only</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;

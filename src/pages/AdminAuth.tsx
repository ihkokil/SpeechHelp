
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, LockKeyhole, Shield, Settings, Info, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
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
  const { isAuthenticated, isLoading, signIn, verify2FA, requestPasswordReset, createDefaultAdmin } = useAdminAuth();
  const [needs2FA, setNeeds2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTab, setFormTab] = useState<'login' | 'forgot-password'>('login');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState(false);
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

  const handleCreateDefaultAdmin = async () => {
    setIsCreatingAdmin(true);
    setSetupError(null);
    setSetupSuccess(false);
    
    try {
      console.log('Attempting to create default admin user');
      const result = await createDefaultAdmin();
      console.log('Default admin creation result:', result);
      
      if (result.success) {
        setSetupSuccess(true);
        toast({
          title: "Setup complete",
          description: "Default admin account created. You can now login with username 'speechhelpmaster' and password 'Admin@123'.",
        });
        
        loginForm.setValue('username', 'speechhelpmaster');
        loginForm.setValue('password', 'Admin@123');
      } else {
        setSetupError(result.error || "Failed to create default admin account.");
        toast({
          title: "Setup failed",
          description: result.error || "Failed to create default admin account.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Create default admin error:', error);
      setSetupError(error.message || "An unexpected error occurred. Please try again.");
      toast({
        title: "Setup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsCreatingAdmin(false);
  };

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="mb-6 flex items-center space-x-2">
        <img 
          src="/Speech Help - Logo.svg" 
          alt="Speech Help Logo" 
          className="h-10" 
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
            <div className="mt-2">
              <strong>How to fix this:</strong>
              <ul className="list-disc pl-5 mt-1 text-sm">
                <li>Make sure the function is defined in <code>supabase/functions/admin-auth/index.ts</code></li>
                <li>The <code>config.toml</code> file should have <code>name = "admin-auth"</code></li>
                <li>Deploy your Supabase Functions using the Supabase CLI: <code>supabase functions deploy admin-auth</code></li>
                <li>Or wait for the automatic deployment to complete if you're using a CI/CD pipeline</li>
              </ul>
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
      
      <Card className="w-full max-w-md shadow-lg">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          ) : (
            <Tabs value={formTab} onValueChange={(value) => setFormTab(value as 'login' | 'forgot-password')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
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
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
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
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="forgot-password">
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onSubmitForgotPassword)} className="space-y-4">
                    <div className="flex justify-center my-2">
                      <LockKeyhole className="h-8 w-8 text-pink-600" />
                    </div>
                    
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your admin email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Reset Password"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}

          {!needs2FA && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <Settings className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-500">First-time Setup</span>
              </div>
              
              {setupSuccess && (
                <Alert className="mb-3 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Default admin account is ready. Use username: <strong>speechhelpmaster</strong> and password: <strong>Admin@123</strong> to log in.
                  </AlertDescription>
                </Alert>
              )}
              
              {setupError && (
                <Alert className="mb-3 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {setupError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleCreateDefaultAdmin}
                disabled={isCreatingAdmin}
              >
                {isCreatingAdmin ? "Setting up..." : "Create Default Admin Account"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Use this option only for the initial setup of your admin portal.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-gray-500">
          <p>Secure access for authorized personnel only</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;


import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
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
import { AlertCircle, LockKeyhole, Shield, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface AdminAuthFormProps {
  needs2FA: boolean;
  setNeeds2FA: (value: boolean) => void;
  onSubmitLogin: (data: LoginFormValues) => Promise<void>;
  onSubmitTwoFactor: (data: TwoFactorFormValues) => Promise<void>;
  onSubmitForgotPassword: (data: ForgotPasswordFormValues) => Promise<void>;
  isSubmitting: boolean;
  loginError: string | null;
}

const AdminAuthForm: React.FC<AdminAuthFormProps> = ({
  needs2FA,
  setNeeds2FA,
  onSubmitLogin,
  onSubmitTwoFactor,
  onSubmitForgotPassword,
  isSubmitting,
  loginError
}) => {
  const [formTab, setFormTab] = useState<'login' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);

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

  if (needs2FA) {
    return (
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
        <CardDescription className="text-center">
          Sign in to access the admin dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent>
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
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
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password" 
                            {...field} 
                            className="h-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
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
      </CardContent>
      
      <CardFooter className="justify-center text-sm text-gray-500 pt-0">
        <p>Secure access for authorized personnel only</p>
      </CardFooter>
    </Card>
  );
};

export default AdminAuthForm;

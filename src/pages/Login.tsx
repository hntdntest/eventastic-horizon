import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from '@/contexts/useLanguage';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const Login: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirectAfterLogin || '/select-role';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate authentication - replace with actual auth when connected to Supabase
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any valid email/password combination succeeds
      console.log("Login successful:", data);
      
      // Store user in localStorage for demo purposes
      localStorage.setItem('currentUser', JSON.stringify({
        email: data.email,
        role: null // Role will be selected after login
      }));
      
      navigate(redirectPath);
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t('login.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login.password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{t('login.error')}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-oceanBlue hover:bg-oceanBlue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? t('login.signingIn') : t('login.signIn')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {t('login.noAccount')}{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-oceanBlue"
                onClick={() => navigate("/register")}
              >
                {t('login.signUp')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;

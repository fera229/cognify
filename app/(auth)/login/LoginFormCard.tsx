'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { loginSchema } from '@/util/validation';
import { SearchParams } from '@/util/types';
import { getSafeReturnToPath } from '@/util/validation';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginFormCard(searchParams: SearchParams) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);

      const response = await fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors[0].message || 'Login failed');
      }

      toast.success('Login successful!');

      const params = await searchParams;

      router.push(getSafeReturnToPath(params.returnTo) || '/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form errors
        const newErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full gap-y-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => await handleSubmit(e)}
            className="flex flex-col gap-y-5"
          >
            <div className='"mb-10"'>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="xyz@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className='"mb-6"'>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="********"
                className={errors.password ? 'border-red-500' : ''}
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full mt-8">
              {isLoading ? 'Loging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm w-full">
            Don't have an account?{' '}
            <Link href="/register" className="underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

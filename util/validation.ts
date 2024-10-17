import { Route } from 'next';
import { z } from 'zod';

// Validate user registration data
export const registerSchema = z
  .object({
    username: z.string().min(3, {
      message: 'Username must be at least 3 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    role: z.string(),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .refine(
        (val) =>
          /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/.test(
            val,
          ),
        {
          message:
            'Password must contain at least: one lower case charachter, one upper case charachter, one special charachter and one number.',
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Validate user login data
export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

// Category validation schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Category name is required'),
});

// Course validation schema
export const courseSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable(),
  price: z.number().nullable(),
  is_published: z.boolean().default(false),
  category_id: z.number().nullable(),
});
export const courseFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    price: z.number().nonnegative('Price must be non-negative').optional(),
    category_id: z
      .number()
      .int('Category ID must be an integer')
      .positive('Category ID must be positive')
      .optional(),
    is_published: z.boolean().optional(),
  })
  .partial();

// Type inference
export type CourseFormData = z.infer<typeof courseFormSchema>;

// Validation functions
export const validateCourse = (data: unknown) => {
  return courseSchema.parse(data);
};

export const validateCourseForm = (data: unknown) => {
  return courseFormSchema.parse(data);
};

const returnToSchema = z.string().refine((value) => {
  return (
    !value.startsWith('/logout') &&
    // Regular expression for valid returnTo path:
    // - starts with a slash
    // - until the end of the string, 1 or more:
    //   - numbers
    //   - hash symbols
    //   - forward slashes
    //   - equals signs
    //   - question marks
    //   - lowercase letters
    //   - dashes
    /^\/[\d#/=?a-z-]+$/.test(value)
  );
});

export function getSafeReturnToPath(path: string | string[] | undefined) {
  const result = returnToSchema.safeParse(path);
  if (!result.success) return undefined;
  return result.data as Route;
}

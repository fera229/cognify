import { Sql } from 'postgres';
import { z } from 'zod';

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

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      password_hash varchar(255) NOT NULL,
      role varchar(50) NOT NULL,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS users; `;
}

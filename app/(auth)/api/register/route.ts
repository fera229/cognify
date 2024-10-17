import { NextRequest, NextResponse } from 'next/server';
import { createUserInsecure, getUserInsecure, User } from '@/database/users';
import bcrypt from 'bcrypt';
import { registerSchema } from '@/util/validation';
import { cookies } from 'next/headers';
import { createSessionInsecure } from '@/database/session';
import crypto from 'node:crypto';
import { secureCookieOptions } from '@/util/cookies';

type RegisterResponseBodyPost = {
  user: User;
  errors: {
    message: string;
  }[];
};
export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  // task: implement the user registeration workflow
  // 1. Get the user data from the request body
  const body = await request.json();

  // 2. Validate the user data using the zod schema

  const validatedData = registerSchema.safeParse(body);

  if (!validatedData.success) {
    return NextResponse.json(
      {
        user: {
          id: 0,
          username: '',
          email: '',
          role: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
        errors: validatedData.error.issues,
      },
      { status: 400 },
    );
  }

  console.log('validated data: ', validatedData);

  // 3. Check if the user already exists in the database

  const user = await getUserInsecure(validatedData.data.username);
  const email = await getUserInsecure(validatedData.data.email);

  if (user || email) {
    return NextResponse.json(
      {
        user: {
          id: 0,
          username: '',
          email: '',
          role: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
        errors: [{ message: 'User already taken' }],
      },
      { status: 400 },
    );
  }

  // 4. Hash the user password

  const hashedPassword = await bcrypt.hash(validatedData.data.password, 12);

  // 5. Save the user data with hashed pw to the database and return the user data

  const newUser = await createUserInsecure(
    validatedData.data.username,
    validatedData.data.email,
    hashedPassword,
    validatedData.data.role,
  );
  if (!newUser) {
    return NextResponse.json(
      {
        user: {
          id: 0,
          username: '',
          email: '',
          role: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
        errors: [{ message: 'Sign up Failed' }],
      },
      { status: 400 },
    );
  }

  const token = crypto.randomBytes(100).toString('base64');

  // 7. create the session record
  const session = await createSessionInsecure(token, newUser.id);

  if (!session) {
    return NextResponse.json(
      {
        user: {
          id: 0,
          username: '',
          email: '',
          role: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
        errors: [{ message: 'Session creation failed' }],
      },
      { status: 401 },
    );
  }
  // 8. send the new cookie in the headers

  (await cookies()).set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  return NextResponse.json({ user: newUser, errors: [] });
}

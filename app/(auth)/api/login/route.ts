import { NextRequest, NextResponse } from 'next/server';
import { getUserWithPasswordHashInsecure } from '@/database/users';
import type { User } from '@/database/users';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/util/validation';
import crypto from 'node:crypto';
import { createSessionInsecure } from '@/database/session';
import { cookies } from 'next/headers';
import { secureCookieOptions } from '@/util/cookies';

type LoginResponseBodyPost = {
  user: Pick<User, 'name'>;
  errors: {
    message: string;
  }[];
};
export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponseBodyPost>> {
  // task: implement the user login workflow
  // 1. Get the user data from the request body
  const body = await request.json();

  // 2. Validate the user data using the zod schema

  const validatedData = loginSchema.safeParse(body);

  if (!validatedData.success) {
    return NextResponse.json(
      {
        user: { name: '' },
        errors: validatedData.error.issues,
      },
      { status: 400 },
    );
  }

  //   console.log('validated data: ', validatedData);

  // 3. verify the user data
  //   console.log('Email to be verified: ', validatedData.data.email);

  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    validatedData.data.email,
  );
  //   console.log('userWithPasswordHash:', userWithPasswordHash);

  if (!userWithPasswordHash) {
    return NextResponse.json(
      {
        user: { name: '' },
        errors: [{ message: 'Email or password invalid' }],
      },
      { status: 400 },
    );
  }

  // 4. validate the user's password by comparing with hashed pw
  const isPasswordValid = await bcrypt.compare(
    validatedData.data.password,
    userWithPasswordHash.password_hash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        user: { name: '' },
        errors: [{ message: 'Email or password invalid' }],
      },
      { status: 400 },
    );
  }

  //   console.log('password valid:', isPasswordValid);

  //   //6. create a token for the user

  const token = crypto.randomBytes(100).toString('base64');
  //   console.log('token:', token);

  //   //7. create the session record
  const session = await createSessionInsecure(token, userWithPasswordHash.id);

  if (!session) {
    return NextResponse.json(
      {
        user: { name: '' },
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

  return NextResponse.json({
    user: { name: userWithPasswordHash.name },
    errors: [],
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import bcrypt from 'bcrypt';
import { registerSchema } from '@/util/validation';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import type { Sql } from 'postgres';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the user data from the request body
    const body = await request.json();

    // 2. Validate the user data
    const validatedData = registerSchema.safeParse(body);
    console.log('validated data: ', validatedData);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          user: null,
          errors: validatedData.error.issues,
        },
        { status: 400 },
      );
    }

    // 3. Get database connection

    // 4. Check if user exists
    const [existingUser] = await sql<{ id: number }[]>`
      SELECT
        id
      FROM
        users
      WHERE
        email = ${validatedData.data.email.toLowerCase()}
        OR name = ${validatedData.data.name.toLowerCase()}
    `;

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          errors: [{ message: 'User already exists' }],
        },
        { status: 400 },
      );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(validatedData.data.password, 12);

    // 6. Create user
    const [newUser] = await sql<
      { id: number; name: string; email: string; role: string }[]
    >`
      INSERT INTO
        users (
          name,
          email,
          password_hash,
          role
        )
      VALUES
        (
          ${validatedData.data.name.toLowerCase()},
          ${validatedData.data.email.toLowerCase()},
          ${hashedPassword},
          ${validatedData.data.role}
        )
      RETURNING
        id,
        name,
        email,
        role
    `;

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // 7. Create session
    const token = crypto.randomBytes(100).toString('base64');

    const [session] = await sql<{ token: string }[]>`
      INSERT INTO
        sessions (token, user_id)
      VALUES
        (
          ${token},
          ${newUser.id}
        )
      RETURNING
        token
    `;

    if (!session) {
      throw new Error('Failed to create session');
    }

    // 8. Set cookie
    (await cookies()).set({
      name: 'sessionToken',
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      user: newUser,
      errors: [],
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        user: null,
        errors: [{ message: 'Internal server error during registration' }],
      },
      { status: 500 },
    );
  }
}

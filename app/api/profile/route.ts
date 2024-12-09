import { NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { z } from 'zod';
import type { User } from '@/database/users';

const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  email: z.string().email('Invalid email address'),
});

export async function PATCH(request: Request) {
  try {
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if email is already taken (case insensitive)
    if (validatedData.email.toLowerCase() !== user.email.toLowerCase()) {
      const [existingUser] = await sql<Pick<User, 'id'>[]>`
        SELECT
          id
        FROM
          users
        WHERE
          lower(email) = ${validatedData.email.toLowerCase()}
          AND id != ${user.id}
      `;

      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already in use' },
          { status: 400 },
        );
      }
    }

    // Update user profile
    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET
        name = ${validatedData.name},
        email = ${validatedData.email.toLowerCase()},
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ${user.id}
      RETURNING
        id,
        name,
        email,
        role,
        created_at,
        updated_at
    `;

    if (!updatedUser) {
      throw new Error('Failed to update user profile');
    }

    return NextResponse.json({
      ...updatedUser,
      created_at: new Date(updatedUser.created_at),
      updated_at: new Date(updatedUser.updated_at),
    });
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', status: 400 });
    }
    // For other types of errors, map them to appropriate HTTP responses
    if (error instanceof Error) {
      // Check for specific error types that might need different status codes
      if (error.message === 'Failed to update user profile') {
        return NextResponse.json(
          { message: 'Failed to update profile. Please try again.' },
          { status: 500 },
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Fallback error response for unexpected errors
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}

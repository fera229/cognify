'use server';
import { cache } from 'react';
import { sql } from './connect';
import { cookies } from 'next/headers';
import { getValidSession } from '@/database/session';
import toast from 'react-hot-toast';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  created_at: Date;
  updated_at: Date;
};

type UserWithPasswordHash = User & {
  password_hash: string;
};

export const getUserInsecure = cache(async (name: string) => {
  const [user] = await sql<Omit<User[], 'role' | 'created_at' | 'updated_at'>>`
    SELECT
      users.id,
      users.name,
      users.email
    FROM
      users
    WHERE
      users.name = ${name.toLowerCase()}
  `;
  return user;
});

export const IsRoleInstructor = cache(
  async (userId: number): Promise<Boolean> => {
    const [user] = await sql<Pick<User, 'role'>[]>`
      SELECT
        users.role
      FROM
        users
      WHERE
        users.id = ${userId}
    `;
    if (!user) {
      console.error('User not found');
    }

    toast.error('User not found');
    if (user?.role === 'Instructor') {
      return true;
    }
    return false;
  },
);

export const getUserWithPasswordHashInsecure = cache(async (email: string) => {
  const [user] = await sql<UserWithPasswordHash[]>`
    SELECT
      *
    FROM
      users
    WHERE
      users.email = ${email.toLowerCase()}
  `;
  return user;
});

export const createUserInsecure = cache(
  async (name: string, email: string, password_hash: string, role: string) => {
    try {
      console.log('Creating user:', { name, email, password_hash, role });
      const [user] = await sql<User[]>`
        INSERT INTO
          users (
            name,
            email,
            password_hash,
            role
          )
        VALUES
          (
            ${name.toLowerCase()},
            ${email.toLowerCase()},
            ${password_hash},
            ${role}
          )
        RETURNING
          users.id,
          users.name,
          users.email,
          users.role
      `;
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
);

export const checkIfSessionIsValid = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const validSession =
    sessionToken && (await getValidSession(sessionToken.value));

  if (validSession) {
    return !!validSession;
  }
  return false;
};

interface CookieStore {
  get: (name: string) => { value: string } | undefined;
}

export const getUserFromSession = cache(async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return null;
    }

    const [user] = await sql<User[]>`
      SELECT
        users.*
      FROM
        users
        JOIN sessions ON sessions.user_id = users.id
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
    `;

    return user || null;
  } catch (error) {
    console.error('Error in getUserFromSession:', error);
    return null;
  }
});

// export const getUserFromCourse = cache(async (courseId: number): Promise<User | null> => {
//   try {
//     const [user] = await sql<User[]>`
//       SELECT
//         users.*
//       FROM
//         users
//         JOIN courses ON courses.instructor_id = users.id
//       WHERE
//         courses.id = ${courseId}
//     `;

//     return user || null;
//   } catch (error) {
//     console.error('Error in getUserFromCourse:', error);
//     return null;
//   }
// }
// )

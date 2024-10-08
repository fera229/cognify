import { cache } from 'react';
import { sql } from './connect';
import { cookies } from 'next/headers';
import { getValidSession } from '@/database/session';
export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

type UserWithPasswordHash = User & {
  password_hash: string;
};

export const getUserInsecure = cache(async (username: string) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username,
      users.email
    FROM
      users
    WHERE
      users.username = ${username.toLowerCase()}
  `;
  return user;
});

export const getUserRole = cache(async (userId: number) => {
  const [user] = await sql<Pick<User, 'role'>[]>`
    SELECT
      users.role
    FROM
      users
    WHERE
      users.id = ${userId}
  `;
  return user;
});

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
  async (
    username: string,
    email: string,
    password_hash: string,
    role: string,
  ) => {
    try {
      console.log('Creating user:', { username, email, password_hash, role });
      const [user] = await sql<User[]>`
        INSERT INTO
          users (
            username,
            email,
            password_hash,
            role
          )
        VALUES
          (
            ${username.toLowerCase()},
            ${email.toLowerCase()},
            ${password_hash},
            ${role}
          )
        RETURNING
          users.id,
          users.username,
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
  // 2. Check if the sessionToken cookie is still valid

  const validSession =
    sessionToken && (await getValidSession(sessionToken.value));

  if (validSession) {
    return !!validSession;
  }
  return false;
};

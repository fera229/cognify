//app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get the user from the session
    const cookieStore = await cookies();

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 3. Get the course title from the request body
    const body = await request.json();
    const { title } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 },
      );
    }

    // 4. Create the course with the instructor_id
    const [newCourse] = await sql`
      INSERT INTO
        courses (
          title,
          instructor_id,
          is_published
        )
      VALUES
        (
          ${title.trim()},
          ${user.id},
          FALSE
        )
      RETURNING
        *
    `;

    if (!newCourse) {
      return NextResponse.json(
        { message: 'Failed to create course' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        course: {
          id: newCourse.id,
          title: newCourse.title,
          instructor_id: newCourse.instructor_id,
          created_at: newCourse.created_at,
          is_published: newCourse.is_published,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating course:', error);
    console.log('[COURSES]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

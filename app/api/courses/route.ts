import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid } from '@/database/users';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

type CourseResponseBody = {
  course?: {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    is_published: boolean;
  };
  errors?: {
    message: string;
  }[];
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CourseResponseBody>> {
  try {
    // 1. Get and validate the request body
    const body = await request.json();
    const result = courseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: [{ message: 'Title is required' }] },
        { status: 400 },
      );
    }

    // 2. Verify user session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json(
        { errors: [{ message: 'Unauthorized' }] },
        { status: 401 },
      );
    }

    // 3. Create the course
    const [newCourse] = await sql`
      INSERT INTO
        courses (title, is_published)
      VALUES
        (
          ${result.data.title},
          FALSE
        )
      RETURNING
        id,
        title,
        is_published,
        created_at,
        updated_at;
    `;

    if (!newCourse) {
      throw new Error('Failed to create course');
    }

    // 4. Return the new course data
    return NextResponse.json(
      {
        course: {
          id: newCourse.id,
          title: newCourse.title,
          is_published: newCourse.is_published,
          created_at: newCourse.created_at,
          updated_at: newCourse.updated_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { errors: [{ message: 'Failed to create course' }] },
      { status: 500 },
    );
  }
}

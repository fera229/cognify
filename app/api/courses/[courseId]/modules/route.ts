export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { z } from 'zod';
import { createModule } from '@/database/modules';

// Validation schema for module creation
const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  // description: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    // 1. Verify user session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get the user from session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const paramsAwaited = await params;
    const courseId = paramsAwaited.courseId;
    // 3. Get and verify course ownership
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { message: 'Not authorized to modify this course' },
        { status: 403 },
      );
    }

    // 4. Validate request body
    const body = await request.json();
    const validatedData = moduleSchema.parse(body);

    // 5. Get the next position for the module
    const [maxPosition] = await sql<[{ max: number }]>`
      SELECT
        coalesce(max(POSITION), -1) + 1 AS MAX
      FROM
        modules
      WHERE
        course_id = ${parseInt(courseId)}
    `;

    // 6. Create the module
    const newModule = await createModule(
      parseInt(courseId),
      validatedData.title,
    );
    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid module data', errors: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

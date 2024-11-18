import { NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { z } from 'zod';

const reorderSchema = z.object({
  lessonIds: z.array(z.number()),
});

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  try {
    const paramsAwaited = await params;

    // Validate session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user from session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Parse and validate courseId
    const courseId = parseInt(paramsAwaited.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID' },
        { status: 400 },
      );
    }

    // Verify course exists and user is its creator
    const course = await getCourseById(paramsAwaited.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { message: 'You are not the instructor of this course' },
        { status: 403 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { lessonIds } = reorderSchema.parse(body);

    // Update lesson positions
    for (const [index, lessonId] of lessonIds.entries()) {
      await sql`
        UPDATE lessons
        SET
          POSITION = ${index},
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${lessonId}
          AND module_id = ${paramsAwaited.moduleId}
      `;
    }

    return NextResponse.json({ message: 'Lessons reordered successfully' });
  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json(
      { message: 'Failed to reorder lessons' },
      { status: 500 },
    );
  }
}

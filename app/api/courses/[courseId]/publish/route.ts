export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { sql } from '@/database/connect';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const paramsAwaited = await params;

    // Auth checks
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    // Course ownership checkk
    const course = await getCourseById(paramsAwaited.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if there are any published modules
    const [{ count: publishedModulesCount }] = await sql<[{ count: number }]>`
      SELECT
        count(*)::int
      FROM
        modules
      WHERE
        course_id = ${paramsAwaited.courseId}
        AND is_published = TRUE
    `;

    if (publishedModulesCount === 0) {
      return NextResponse.json(
        { message: 'Publish at least one module first' },
        { status: 400 },
      );
    }

    const [updatedCourse] = await sql`
      UPDATE courses
      SET
        is_published = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ${paramsAwaited.courseId}
      RETURNING
        *
    `;

    revalidatePath(`/teacher/courses/${paramsAwaited.courseId}`);
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[COURSE_PUBLISH]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

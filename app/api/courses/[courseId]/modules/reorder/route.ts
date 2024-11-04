// app/api/courses/[courseId]/modules/reorder/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { z } from 'zod';

// Validation schema for the request body
const reorderSchema = z.object({
  moduleIds: z.array(z.number()),
});

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
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
    const courseId = parseInt(params.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID' },
        { status: 400 },
      );
    }

    // Verify course exists and user is its creator
    const course = await getCourseById(params.courseId);
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
    const { moduleIds } = reorderSchema.parse(body);

    // Update module positions
    try {
      for (const [index, moduleId] of moduleIds.entries()) {
        await sql`
          UPDATE modules
          SET
            POSITION = ${index},
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${moduleId}
            AND course_id = ${courseId}
        `;
      }

      return NextResponse.json({ message: 'Modules reordered successfully' });
    } catch (error) {
      console.error('Error updating module positions:', error);
      return NextResponse.json(
        { message: 'Failed to update module positions' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error reordering modules:', error);
    return NextResponse.json(
      { message: 'Failed to reorder modules' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { sql } from '@/database/connect';
import { validateCourseForm } from '@/util/validation';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    // Validate the input data
    const validatedData = validateCourseForm(body);
    console.log('Validated data:', validatedData);

    // Verify the session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Confirm the user is the instructor of the course
    const courseId = parseInt(params.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID' },
        { status: 400 },
      );
    }

    const course = await getCourseById(params.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }
    console.log(course);
    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { message: 'You are not the instructor of this course' },
        { status: 403 },
      );
    }

    // Update the course data
    const [updatedCourse] = await sql`
      UPDATE courses
      SET
        title = coalesce(
          ${validatedData.title ?? null},
          title
        ),
        description = coalesce(
          ${validatedData.description ?? null},
          description
        )
      WHERE
        id = ${params.courseId}
      RETURNING
        *
    `;

    console.log('Updated course:', updatedCourse);

    if (!updatedCourse) {
      return NextResponse.json(
        { message: 'Failed to update course' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

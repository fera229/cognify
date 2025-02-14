export const runtime = 'nodejs';
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
    const awaitedParams = await params;
    const courseId = parseInt(awaitedParams.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID' },
        { status: 400 },
      );
    }

    const course = await getCourseById(awaitedParams.courseId);
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

    // const [updatedCourse] = await sql`
    // UPDATE courses

    // SET
    // title = CASE
    //   WHEN ${validatedData.title IS NOT NULL} THEN ${validatedData.title}
    //   ELSE title
    // END,

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
        ),
        image_url = coalesce(
          ${validatedData.image_url ?? null},
          image_url
        ),
        category_id = coalesce(
          ${validatedData.category_id ?? null},
          category_id
        ),
        price = coalesce(
          ${validatedData.price ?? null},
          price
        )
      WHERE
        id = ${awaitedParams.courseId}
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

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const paramsAwaited = await params;

    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

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

    await sql`
      DELETE FROM courses
      WHERE
        id = ${paramsAwaited.courseId}
    `;

    return NextResponse.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('[COURSE_DELETE]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

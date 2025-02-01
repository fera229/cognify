export const runtime = 'nodejs';
import { getCourseById, createAttachment } from '@/database/courses';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const body = await request.json();
    const paramsAwaited = await params;

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
    const courseId = parseInt(paramsAwaited.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID' },
        { status: 400 },
      );
    }

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

    // Create the attachment with the provided name
    const attachment = await createAttachment({
      url: body.attachments,
      name:
        body.name || body.attachments.split('/').pop() || 'Unnamed attachment',
      courseId: courseId,
    });

    return NextResponse.json({ attachment }, { status: 200 });
  } catch (error) {
    console.error('Error creating attachment:', error);
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

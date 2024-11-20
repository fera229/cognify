import { deleteAttachment, getCourseById } from '@/database/courses';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { error } from 'console';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; attachmentId: string } },
) {
  try {
    // do all validations:

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
    const paramsAwaited = await params;

    const courseId = parseInt(paramsAwaited.courseId, 10);
    const attachmentId = parseInt(paramsAwaited.attachmentId, 10);
    if (isNaN(courseId) || isNaN(attachmentId)) {
      return NextResponse.json(
        { message: 'Invalid course ID or Attachment ID' },
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

    await deleteAttachment(attachmentId);
    return NextResponse.json({ message: 'Attachment deleted' });
  } catch {
    console.log('Error deleting attachment', error);
    return NextResponse.json(
      { message: 'Failed to delete attachment' },
      { status: 500 },
    );
  }
}

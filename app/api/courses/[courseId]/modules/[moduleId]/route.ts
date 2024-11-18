import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { sql } from '@/database/connect';
import { updateModule } from '@/database/modules';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  try {
    const paramsAwaited = await params;

    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

    const body = await req.json();
    console.log('body: ' + body);
    const updatedModule = await updateModule(paramsAwaited.moduleId, body);

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error('[MODULE_UPDATE]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  try {
    const paramsAwaited = await params;
    // Verify session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get course and verify ownership
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

    // Delete the module
    await sql`
      DELETE FROM modules
      WHERE
        id = ${paramsAwaited.moduleId}
        AND course_id = ${paramsAwaited.courseId}
    `;

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('[MODULE_DELETE]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

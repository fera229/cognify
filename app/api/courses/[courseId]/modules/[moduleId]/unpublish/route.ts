import { getCourseById } from '@/database/courses';
import { unpublishModule } from '@/database/modules';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Course ownership check
    const course = await getCourseById(paramsAwaited.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }
    if (course.instructor_id !== user.id) {
      toast.error('Unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // unpublish module
    const result = await unpublishModule(paramsAwaited.moduleId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { unpublishLesson } from '@/database/lessons';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string; moduleId: string; lessonId: string };
  },
) {
  try {
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const course = await getCourseById(params.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = await unpublishLesson(params.lessonId, params.moduleId);

    if (!result.lesson) {
      return NextResponse.json(
        { message: 'Failed to unpublish lesson' },
        { status: 400 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[LESSON_UNPUBLISH]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

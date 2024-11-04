import { publishLesson, unpublishLesson } from '@/database/lessons';
import { getCourseById } from '@/database/courses';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; moduleId: string; lessonId: string } },
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

    const lesson = await publishLesson(params.lessonId);

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[LESSON_PUBLISH]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; moduleId: string; lessonId: string } },
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

    const lesson = await unpublishLesson(params.lessonId);

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[LESSON_UNPUBLISH]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

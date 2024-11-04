// app/api/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/route.ts
import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { updateLesson, deleteLesson, getLessonById } from '@/database/lessons';
import { z } from 'zod';

const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  is_free: z.boolean().optional(),
  video_url: z.string().optional(),
});

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

    const body = await req.json();
    const validatedData = updateLessonSchema.parse(body);

    const updatedLesson = await updateLesson(params.lessonId, validatedData);

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('[LESSON_UPDATE]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 },
      );
    }
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

    await deleteLesson(params.lessonId);

    return NextResponse.json({ message: 'Lesson deleted' });
  } catch (error) {
    console.error('[LESSON_DELETE]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

export async function GET(
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

    // For instructors or enrolled students
    const lesson = await getLessonById(params.lessonId);
    if (!lesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[LESSON_GET]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

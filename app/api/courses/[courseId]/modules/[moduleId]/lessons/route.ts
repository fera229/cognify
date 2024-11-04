// app/api/courses/[courseId]/modules/[moduleId]/lessons/route.ts
import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { createLesson, getLessonsByModuleId } from '@/database/lessons';
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  try {
    // Verify session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user from session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify course and ownership
    const course = await getCourseById(params.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json(
        { message: 'Not authorized to modify this course' },
        { status: 403 },
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createLessonSchema.parse(body);

    // Create the lesson
    const newLesson = await createLesson(parseInt(params.moduleId), {
      title: validatedData.title,
      description: validatedData.description,
      is_free: validatedData.isFree,
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid lesson data', errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Add this if you need to get all lessons for a module
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  try {
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const course = await getCourseById(params.courseId);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 },
      );
    }

    // For instructors, return all lessons
    // For students, return only published lessons or lessons they have access to
    const lessons = await getLessonsByModuleId(params.moduleId);

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

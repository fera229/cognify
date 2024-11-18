import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { sql } from '@/database/connect';
import toast from 'react-hot-toast';

interface Params {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
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
    const course = await getCourseById(params.courseId);
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

    // Toggle lesson publish state
    const [updatedLesson] = await sql`
      WITH
        before_state AS (
          SELECT
            is_published
          FROM
            lessons
          WHERE
            id = ${params.lessonId}
            AND module_id = ${params.moduleId}
        )
      UPDATE lessons
      SET
        is_published = NOT is_published,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ${params.lessonId}
        AND module_id = ${params.moduleId}
      RETURNING
        id,
        title,
        description,
        POSITION,
        module_id,
        is_published,
        is_free,
        video_url,
        duration,
        created_at,
        updated_at,
        (
          SELECT
            is_published
          FROM
            before_state
        ) AS previous_state
    `;

    if (!updatedLesson) {
      return NextResponse.json(
        { message: 'Lesson not found' },
        { status: 404 },
      );
    }

    console.log('Lesson update:', {
      lessonId: params.lessonId,
      previousState: updatedLesson.previous_state,
      newState: updatedLesson.is_published,
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('[LESSON_PUBLISH]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { checkIfSessionIsValid, getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { getModuleById } from '@/database/modules';
import { getLessonById } from '@/database/lessons';
import { sql } from '@/database/connect';

interface Params {
  courseId: string;
  actions: string[];
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const paramsAwaited = await params;
    // Auth checks
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const [contentType, contentId, action] = paramsAwaited.actions;

    switch (contentType) {
      case 'publish': {
        // Publishing the course itself
        const [{ count: publishedModulesCount }] = await sql<
          [{ count: number }]
        >`
          SELECT
            count(*)::int
          FROM
            modules
          WHERE
            course_id = ${paramsAwaited.courseId}
            AND is_published = TRUE
        `;

        if (publishedModulesCount === 0) {
          return NextResponse.json(
            { message: 'Publish at least one module first' },
            { status: 400 },
          );
        }

        const [updatedCourse] = await sql`
          UPDATE courses
          SET
            is_published = NOT is_published,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${paramsAwaited.courseId}
          RETURNING
            *
        `;

        return NextResponse.json(updatedCourse);
      }

      case 'modules': {
        // Publishing a module
        if (!contentId) {
          return NextResponse.json(
            { message: 'Module ID is required' },
            { status: 400 },
          );
        }
        const module = await getModuleById(contentId);
        if (!module) {
          return NextResponse.json(
            { message: 'Module not found' },
            { status: 404 },
          );
        }

        const [{ count: publishedLessonsCount }] = await sql<
          [{ count: number }]
        >`
          SELECT
            count(*)::int
          FROM
            lessons
          WHERE
            module_id = ${contentId}
            AND is_published = TRUE
        `;

        if (publishedLessonsCount === 0) {
          return NextResponse.json(
            { message: 'Publish at least one lesson first' },
            { status: 400 },
          );
        }

        const [updatedModule] = await sql`
          UPDATE modules
          SET
            is_published = NOT is_published,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${contentId}
            AND course_id = ${paramsAwaited.courseId}
          RETURNING
            *
        `;

        return NextResponse.json(updatedModule);
      }

      case 'lessons': {
        const moduleId = contentId;
        const lessonId = paramsAwaited.actions[2];

        if (!moduleId || !lessonId) {
          return NextResponse.json(
            { message: 'Module ID and Lesson ID are required' },
            { status: 400 },
          );
        }

        const [updatedLesson] = await sql`
          UPDATE lessons
          SET
            is_published = NOT is_published,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${lessonId}
            AND module_id = ${moduleId}
          RETURNING
            *
        `;

        return NextResponse.json(updatedLesson);
      }

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('[COURSE_ACTION]', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}

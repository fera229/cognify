import { cache } from 'react';
import { sql } from './connect';
import type { Lesson, TranscriptSegment } from '@/util/types';

export const getLessonById = cache(
  async (lessonId: string): Promise<Lesson | null> => {
    try {
      const [lesson] = await sql<
        (Lesson & {
          transcripts?: {
            transcript_segments: TranscriptSegment[];
          }[];
        })[]
      >`
        SELECT
          l.*,
          json_agg(
            json_build_object(
              'transcript_segments',
              vt.transcript_segments
            )
          ) FILTER (
            WHERE
              vt.id IS NOT NULL
          ) AS transcripts
        FROM
          lessons l
          LEFT JOIN video_transcripts vt ON vt.lesson_id = l.id
        WHERE
          l.id = ${lessonId}
        GROUP BY
          l.id
      `;

      if (!lesson) return null;

      return {
        ...lesson,
        created_at: new Date(lesson.created_at),
        updated_at: new Date(lesson.updated_at),
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch lesson');
    }
  },
);

export const getLessonsByModuleId = cache(
  async (moduleId: string): Promise<Lesson[]> => {
    try {
      const lessons = await sql<Lesson[]>`
        SELECT
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
          updated_at
        FROM
          lessons
        WHERE
          module_id = ${moduleId}
        ORDER BY
          POSITION ASC
      `;

      return lessons.map((lesson) => ({
        ...lesson,
        created_at: new Date(lesson.created_at),
        updated_at: new Date(lesson.updated_at),
      }));
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch lessons');
    }
  },
);

export const createLesson = cache(
  async (
    moduleId: number,
    data: {
      title: string;
      description?: string;
      is_free: boolean;
    },
  ): Promise<Lesson | null> => {
    try {
      // Get the next position
      const [maxPosition] = await sql<[{ max: number }]>`
        SELECT
          coalesce(max(POSITION), -1) + 1 AS MAX
        FROM
          lessons
        WHERE
          module_id = ${moduleId}
      `;

      const [lesson] = await sql<Lesson[]>`
        INSERT INTO
          lessons (
            title,
            description,
            POSITION,
            module_id,
            is_free,
            is_published
          )
        VALUES
          (
            ${data.title},
            ${data.description || null},
            ${maxPosition.max},
            ${moduleId},
            ${data.is_free},
            FALSE
          )
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
          updated_at
      `;
      if (!lesson) return null;
      return {
        ...lesson,
        created_at: new Date(lesson.created_at),
        updated_at: new Date(lesson.updated_at),
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to create lesson');
    }
  },
);

export const updateLesson = cache(
  async (lessonId: string, data: Partial<Lesson>): Promise<Lesson | null> => {
    try {
      const [updatedLesson] = await sql<Lesson[]>`
        UPDATE lessons
        SET
          title = coalesce(
            ${data.title ?? null},
            title
          ),
          description = coalesce(
            ${data.description ?? null},
            description
          ),
          is_published = coalesce(
            ${data.is_published ?? null},
            is_published
          ),
          is_free = coalesce(
            ${data.is_free ?? null},
            is_free
          ),
          video_url = coalesce(
            ${data.video_url ?? null},
            video_url
          ),
          duration = coalesce(
            ${data.duration ?? null},
            duration
          ),
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${lessonId}
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
          updated_at
      `;
      if (!updatedLesson) return null;
      return {
        ...updatedLesson,
        created_at: new Date(updatedLesson.created_at),
        updated_at: new Date(updatedLesson.updated_at),
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to update lesson');
    }
  },
);

export const reorderLessons = cache(
  async (moduleId: number, lessonIds: number[]): Promise<void> => {
    try {
      // Begin transaction
      await sql.begin(async (sql) => {
        for (let i = 0; i < lessonIds.length; i++) {
          await sql`
            UPDATE lessons
            SET
              POSITION = ${i},
              updated_at = CURRENT_TIMESTAMP
            WHERE
              id = ${lessonIds[i] ?? 0}
              AND module_id = ${moduleId}
          `;
        }
      });
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to reorder lessons');
    }
  },
);

export const publishLesson = cache(
  async (lessonId: string): Promise<Lesson | null> => {
    try {
      const [lesson] = await sql<Lesson[]>`
        UPDATE lessons
        SET
          is_published = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${lessonId}
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
          updated_at
      `;
      if (!lesson || lesson.id === undefined) return null;
      return {
        ...lesson,
        created_at: new Date(lesson.created_at),
        updated_at: new Date(lesson.updated_at),
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to publish lesson');
    }
  },
);

export const unpublishLesson = cache(
  async (
    lessonId: string,
    moduleId: string,
  ): Promise<{
    lesson: Lesson | null;
    moduleUnpublished: boolean;
    courseUnpublished: boolean;
  }> => {
    try {
      return await sql.begin(async (sql) => {
        // 1. Unpublish the lesson
        const [updatedLesson] = await sql<Lesson[]>`
          UPDATE lessons
          SET
            is_published = FALSE,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${lessonId}
          RETURNING
            *
        `;

        if (!updatedLesson) {
          return {
            lesson: null,
            moduleUnpublished: false,
            courseUnpublished: false,
          };
        }

        // 2. Check if it was the last published lesson in this module
        const [{ lessonCount }] = await sql<[{ lessonCount: number }]>`
          SELECT
            count(*)::int AS "lessonCount"
          FROM
            lessons
          WHERE
            module_id = ${moduleId}
            AND is_published = TRUE
        `;

        let moduleUnpublished = false;
        let courseUnpublished = false;

        // 3. If no published lessons remain, get module info and check course
        if (lessonCount === 0) {
          // Get module and course info
          const [moduleInfo] = await sql<[{ course_id: number }]>`
            UPDATE modules
            SET
              is_published = FALSE,
              updated_at = CURRENT_TIMESTAMP
            WHERE
              id = ${moduleId}
            RETURNING
              course_id
          `;

          moduleUnpublished = true;

          // Check if this was the last published module in the course
          const [{ moduleCount }] = await sql<[{ moduleCount: number }]>`
            SELECT
              count(*)::int AS "moduleCount"
            FROM
              modules
            WHERE
              course_id = ${moduleInfo.course_id}
              AND is_published = TRUE
          `;

          // If no published modules remain, unpublish the course
          if (moduleCount === 0) {
            await sql`
              UPDATE courses
              SET
                is_published = FALSE,
                updated_at = CURRENT_TIMESTAMP
              WHERE
                id = ${moduleInfo.course_id}
            `;
            courseUnpublished = true;
          }
        }

        return {
          lesson: {
            ...updatedLesson,
            created_at: new Date(updatedLesson.created_at),
            updated_at: new Date(updatedLesson.updated_at),
          },
          moduleUnpublished,
          courseUnpublished,
        };
      });
    } catch (error) {
      console.error('[UNPUBLISH_LESSON]', error);
      throw new Error('Failed to unpublish lesson');
    }
  },
);

export const deleteLesson = cache(async (lessonId: string): Promise<void> => {
  try {
    await sql`
      DELETE FROM lessons
      WHERE
        id = ${lessonId}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete lesson');
  }
});

// Additional helper functions

export const getPublishedLessonsCount = cache(
  async (moduleId: string): Promise<number> => {
    try {
      const [result] = await sql<[{ count: number }]>`
        SELECT
          count(*)::int
        FROM
          lessons
        WHERE
          module_id = ${moduleId}
          AND is_published = TRUE
      `;

      return result.count;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to count published lessons');
    }
  },
);

export const getFreeLessonsCount = cache(
  async (moduleId: string): Promise<number> => {
    try {
      const [result] = await sql<[{ count: number }]>`
        SELECT
          count(*)::int
        FROM
          lessons
        WHERE
          module_id = ${moduleId}
          AND is_free = TRUE
      `;

      return result.count;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to count free lessons');
    }
  },
);

import 'server-only';
import { cache } from 'react';
import { sql } from './connect';
import type { Lesson, Module } from '@/util/types';
import { unpublishCourse } from './courses';

// Database return types (matching actual PostgreSQL returns)
interface ModuleFromDB {
  id: number;
  title: string;
  description: string | null;
  position: number;
  course_id: number;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

interface LessonFromDB {
  id: number;
  title: string;
  description: string | null;
  position: number;
  module_id: number;
  is_published: boolean;
  is_free: boolean;
  video_url: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

interface ModuleWithLessonsFromDB extends ModuleFromDB {
  lessons: LessonFromDB[] | null;
}

// Helper function to convert DB timestamps to Dates
const convertModuleFromDB = (module: ModuleFromDB): Module => ({
  ...module,
  created_at: new Date(module.created_at),
  updated_at: new Date(module.updated_at),
});

const convertLessonFromDB = (lesson: LessonFromDB): Lesson => ({
  ...lesson,
  created_at: new Date(lesson.created_at),
  updated_at: new Date(lesson.updated_at),
});

export const getCourseModules = cache(
  async (course_id: string): Promise<Module[]> => {
    try {
      const courseIdNum = parseInt(course_id, 10);
      if (isNaN(courseIdNum)) {
        throw new Error('Invalid course ID');
      }

      const modules = await sql<ModuleFromDB[]>`
        SELECT
          id,
          title,
          description,
          position,
          course_id,
          is_published,
          is_free,
          created_at,
          updated_at
        FROM
          modules
        WHERE
          course_id = ${courseIdNum}
        ORDER BY
          position ASC
      `;

      return modules.map(convertModuleFromDB);
    } catch (error) {
      console.error('[GET_COURSE_MODULES]', error);
      throw new Error('Failed to fetch course modules');
    }
  },
);

export const createModule = cache(
  async (course_id: number, title: string): Promise<Module> => {
    try {
      if (!course_id || !title.trim()) {
        throw new Error('Course ID and title are required');
      }

      const [maxPosition] = await sql<[{ max: number }]>`
        SELECT
          coalesce(max(position), -1) + 1 AS max
        FROM
          modules
        WHERE
          course_id = ${course_id}
      `;

      const [module] = await sql<ModuleFromDB[]>`
        INSERT INTO
          modules (
            title,
            course_id,
            position,
            is_published,
            is_free
          )
        VALUES
          (
            ${title},
            ${course_id},
            ${maxPosition.max},
            FALSE,
            FALSE
          )
        RETURNING
          *
      `;

      if (!module) {
        throw new Error('Failed to create module');
      }

      return convertModuleFromDB(module);
    } catch (error) {
      console.error('[CREATE_MODULE]', error);
      throw new Error('Failed to create module');
    }
  },
);

export const reorderModules = cache(
  async (courseId: number, moduleIds: number[]): Promise<void> => {
    try {
      if (!courseId || typeof courseId !== 'number') {
        throw new Error('Invalid course ID');
      }

      if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
        throw new Error('Module IDs must be a non-empty array');
      }

      // Validate all moduleIds are numbers
      if (!moduleIds.every((id): id is number => typeof id === 'number')) {
        throw new Error('All module IDs must be numbers');
      }

      await sql.begin(async (sql) => {
        for (let i = 0; i < moduleIds.length; i++) {
          // Ensure moduleId exists before querying
          const moduleId = moduleIds[i];
          if (typeof moduleId !== 'number') {
            throw new Error(`Invalid module ID at position ${i}`);
          }

          await sql`
            UPDATE modules
            SET
              position = ${i},
              updated_at = current_timestamp
            WHERE
              id = ${moduleId}
              AND course_id = ${courseId}
          `;
        }
      });
    } catch (error) {
      console.error('[REORDER_MODULES]', error);
      throw new Error('Failed to reorder modules');
    }
  },
);

export const getModuleById = cache(
  async (moduleId: string): Promise<Module | null> => {
    try {
      const moduleIdNum = parseInt(moduleId, 10);
      if (isNaN(moduleIdNum)) {
        throw new Error('Invalid module ID');
      }

      const [module] = await sql<ModuleWithLessonsFromDB[]>`
        SELECT
          m.*,
          coalesce(
            json_agg(
              json_build_object(
                'id',
                l.id,
                'title',
                l.title,
                'description',
                l.description,
                'position',
                l.position,
                'module_id',
                l.module_id,
                'is_published',
                l.is_published,
                'is_free',
                l.is_free,
                'video_url',
                l.video_url,
                'duration',
                l.duration,
                'created_at',
                l.created_at,
                'updated_at',
                l.updated_at
              )
              ORDER BY
                l.position
            ) FILTER (
              WHERE
                l.id IS NOT NULL
            ),
            NULL
          ) AS lessons
        FROM
          modules m
          LEFT JOIN lessons l ON l.module_id = m.id
        WHERE
          m.id = ${moduleIdNum}
        GROUP BY
          m.id
      `;

      if (!module) return null;

      return {
        ...convertModuleFromDB(module),
        lessons: module.lessons?.map(convertLessonFromDB) || [],
      };
    } catch (error) {
      console.error('[GET_MODULE]', error);
      throw new Error('Failed to fetch module');
    }
  },
);

export const updateModule = cache(
  async (moduleId: string, data: Partial<Module>): Promise<Module | null> => {
    try {
      const [updatedModule] = await sql<ModuleFromDB[]>`
        UPDATE modules
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
          updated_at = current_timestamp
        WHERE
          id = ${moduleId}
        RETURNING
          *
      `;

      if (!updatedModule) {
        throw new Error('Failed to update module');
      }

      return convertModuleFromDB(updatedModule);
    } catch (error) {
      console.error('[UPDATE_MODULE]', error);
      throw new Error('Failed to update module');
    }
  },
);

export const publishModule = cache(
  async (moduleId: string): Promise<Module | null> => {
    try {
      // First verify there is at least one published lesson
      const [{ count }] = await sql<[{ count: number }]>`
        SELECT
          count(*)::int
        FROM
          lessons
        WHERE
          module_id = ${moduleId}
          AND is_published = TRUE
      `;

      if (count === 0) {
        throw new Error('Cannot publish module without published lessons');
      }

      const [updatedModule] = await sql<ModuleFromDB[]>`
        UPDATE modules
        SET
          is_published = TRUE,
          updated_at = current_timestamp
        WHERE
          id = ${moduleId}
          AND is_published = FALSE
        RETURNING
          *
      `;

      if (!updatedModule) return null;

      return convertModuleFromDB(updatedModule);
    } catch (error) {
      console.error('[PUBLISH_MODULE]', error);
      throw error;
    }
  },
);

export const unpublishModule = cache(
  async (
    moduleId: string,
  ): Promise<{
    module: Module | null;
    courseUnpublished: boolean;
  }> => {
    try {
      return await sql.begin(async (sql) => {
        // 1. Get the module to find its course_id
        const [moduleToUpdate] = await sql<ModuleFromDB[]>`
          SELECT
            *
          FROM
            modules
          WHERE
            id = ${moduleId}
        `;

        if (!moduleToUpdate) {
          return { module: null, courseUnpublished: false };
        }

        // 2. Unpublish the module
        const [updatedModule] = await sql<ModuleFromDB[]>`
          UPDATE modules
          SET
            is_published = FALSE,
            updated_at = current_timestamp
          WHERE
            id = ${moduleId}
          RETURNING
            *
        `;

        // 3. Check if it was the last published module
        const [{ count }] = await sql<[{ count: number }]>`
          SELECT
            count(*)::int
          FROM
            modules
          WHERE
            course_id = ${moduleToUpdate.course_id}
            AND is_published = TRUE
            AND id != ${moduleId}
        `;

        let courseUnpublished = false;

        // 4. If no published modules remain, cascade to course
        if (count === 0) {
          const updatedCourse = await unpublishCourse(
            moduleToUpdate.course_id.toString(),
          );
          courseUnpublished = !!updatedCourse;
        }

        if (!updatedModule) {
          throw new Error('Failed to unpublish module');
        }

        return {
          module: convertModuleFromDB(updatedModule),
          courseUnpublished,
        };
      });
    } catch (error) {
      console.error('[UNPUBLISH_MODULE]', error);
      throw new Error('Failed to unpublish module');
    }
  },
);

export const deleteModule = cache(async (moduleId: string): Promise<void> => {
  try {
    await sql`
      DELETE FROM modules
      WHERE
        id = ${moduleId}
    `;
  } catch (error) {
    console.error('[DELETE_MODULE]', error);
    throw new Error('Failed to delete module');
  }
});

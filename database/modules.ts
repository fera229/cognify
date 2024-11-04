import { cache } from 'react';
import { sql } from './connect';
import { Lesson, Module } from '@/util/types';

type ModuleFormDB = {
  id: number;
  title: string;
  description: string | null;
  position: number;
  course_id: number;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  lessons: Lesson[];
};

export const getCourseModules = cache(
  async (course_id: string): Promise<Module[]> => {
    try {
      const modules = await sql<ModuleFormDB[]>`
        SELECT
          id,
          title,
          description,
          POSITION,
          course_id,
          is_published,
          is_free,
          created_at,
          updated_at
        FROM
          modules
        WHERE
          course_id = ${Number(course_id)}
        ORDER BY
          POSITION ASC
      `;
      return modules.map((module) => ({
        ...module,
        created_at: new Date(module.created_at),
        updated_at: new Date(module.updated_at),
        lessons: [],
      }));
    } catch (error) {
      console.log('Database Error:', error);
      throw new Error('Failed to fetch course modules');
    }
  },
);

export const createModule = cache(
  async (course_id: number, title: string): Promise<Module> => {
    try {
      const [maxPosition] = await sql<[{ max: number }]>`
        SELECT
          coalesce(max(POSITION), -1) + 1 AS MAX
        FROM
          modules
        WHERE
          course_id = ${course_id}
      `;

      const result = await sql<ModuleFormDB[]>`
        INSERT INTO
          modules (
            title,
            course_id,
            POSITION,
            is_published
          )
        VALUES
          (
            ${title},
            ${course_id},
            ${maxPosition.max},
            FALSE
          )
        RETURNING
          id,
          title,
          description,
          POSITION,
          course_id,
          is_published,
          created_at,
          updated_at
      `;
      if (!result[0]) {
        throw new Error('Failed to create module');
      }
      const newModule = result[0];
      console.log('new module: ' + newModule);

      return {
        ...newModule,
        created_at: new Date(newModule.created_at),
        updated_at: new Date(newModule.updated_at),
        lessons: [],
      };
    } catch (error) {
      console.log('Database Error:', error);
      throw new Error('Failed to create module');
    }
  },
);

export const reorderModules = cache(
  async (courseId: number, moduleIds: number[]): Promise<void> => {
    try {
      // Execute updates sequentially
      for (let i = 0; i < moduleIds.length; i++) {
        await sql<Module[]>`
          UPDATE modules
          SET
            POSITION = ${i}::integer,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = ${moduleIds[i] as number}::integer
            AND course_id = ${courseId}::integer
        `;
      }
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to reorder modules');
    }
  },
);

export const getNextModulePosition = cache(
  async (courseId: number): Promise<number> => {
    try {
      const [result] = await sql<[{ max: number }]>`
        SELECT
          coalesce(max(POSITION), -1) + 1 AS MAX
        FROM
          modules
        WHERE
          course_id = ${courseId}::integer
      `;
      return result.max;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to get next module position');
    }
  },
);

export const getModuleById = cache(
  async (moduleId: string): Promise<Module | null> => {
    try {
      // First get the module with its lessons
      const [module] = await sql<ModuleFormDB[]>`
        SELECT
          m.id,
          m.title,
          m.description,
          m.position,
          m.course_id,
          m.is_published,
          m.created_at,
          m.updated_at,
          json_agg(
            json_build_object(
              'id',
              l.id,
              'title',
              l.title,
              'description',
              l.description,
              'is_free',
              l.is_free,
              'position',
              l.position
            )
          ) FILTER (
            WHERE
              l.id IS NOT NULL
          ) AS lessons
        FROM
          modules m
          LEFT JOIN lessons l ON l.module_id = m.id
        WHERE
          m.id = ${moduleId}
        GROUP BY
          m.id
      `;

      if (!module) return null;

      return {
        ...module,
        created_at: new Date(module.created_at),
        updated_at: new Date(module.updated_at),
        lessons: module.lessons || [],
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch module');
    }
  },
);

export const updateModule = cache(
  async (moduleId: string, data: Partial<Module>) => {
    try {
      const [updatedModule] = await sql<Module[]>`
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
            ${data.is_published ?? false},
            is_published
          )
        WHERE
          id = ${moduleId}
        RETURNING
          *
      `;

      if (!updatedModule) {
        throw new Error('Failed to update module');
      }

      return {
        ...updatedModule,
        created_at: new Date(updatedModule.created_at),
        updated_at: new Date(updatedModule.updated_at),
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to update module');
    }
  },
);

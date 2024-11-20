import { cache } from 'react';
import { sql } from './connect';
import type { Attachment, Category, Course } from '@/util/types';
import type { CourseFromDB } from '@/util/types';

export const getPublicCourses = cache(async (): Promise<Course[]> => {
  try {
    const courses = await sql<CourseFromDB[]>`
      SELECT
        c.*,
        coalesce(
          json_agg(
            CASE
              WHEN m.id IS NOT NULL THEN json_build_object(
                'id',
                m.id,
                'title',
                m.title,
                'description',
                m.description,
                'position',
                m.position,
                'course_id',
                m.course_id,
                'is_published',
                m.is_published,
                'is_free',
                m.is_free,
                'created_at',
                m.created_at,
                'updated_at',
                m.updated_at
              )
              ELSE NULL
            END
          ) FILTER (
            WHERE
              m.id IS NOT NULL
          ),
          '[]'::json
        ) AS modules
      FROM
        courses c
        LEFT JOIN modules m ON c.id = m.course_id
      WHERE
        c.is_published = TRUE
      GROUP BY
        c.id
      ORDER BY
        c.created_at DESC
    `;

    return courses.map((course) => ({
      ...course,
      created_at: new Date(course.created_at),
      updated_at: new Date(course.updated_at),
      modules: Array.isArray(course.modules)
        ? course.modules.map((m) => ({
            ...m,
            created_at: new Date(m.created_at),
            updated_at: new Date(m.updated_at),
          }))
        : [],
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return []; // Return empty array instead of throwing
  }
});

export const getTeacherCourses = cache(
  async (instructorId: number): Promise<Course[]> => {
    try {
      const courses = await sql<CourseFromDB[]>`
        SELECT
          c.*,
          json_agg(
            CASE
              WHEN m.id IS NOT NULL THEN json_build_object(
                'id',
                m.id,
                'title',
                m.title,
                'description',
                m.description,
                'position',
                m.position,
                'course_id',
                m.course_id,
                'is_published',
                m.is_published,
                'is_free',
                m.is_free,
                'created_at',
                m.created_at,
                'updated_at',
                m.updated_at
              )
              ELSE NULL
            END
          ) FILTER (
            WHERE
              m.id IS NOT NULL
          ) AS modules
        FROM
          courses c
          LEFT JOIN modules m ON c.id = m.course_id
        WHERE
          c.instructor_id = ${instructorId}
        GROUP BY
          c.id
        ORDER BY
          c.created_at DESC
      `;

      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        image_url: course.image_url,
        instructor_id: course.instructor_id,
        price: course.price,
        is_published: course.is_published,
        category_id: course.category_id,
        created_at: new Date(course.created_at),
        updated_at: new Date(course.updated_at),
        modules: course.modules?.[0]
          ? course.modules.map((m) => ({
              ...m,
              created_at: new Date(m.created_at),
              updated_at: new Date(m.updated_at),
            }))
          : [],
      }));
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch teacher courses');
    }
  },
);

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const categories = await sql<{ id: number; name: string }[]>`
      SELECT
        id,
        name
      FROM
        categories
      ORDER BY
        name ASC
    `;

    return (
      categories?.map((category) => ({
        label: category.name,
        value: category.id.toString(),
      })) || []
    );
  } catch (error) {
    console.error('Database Error:', error);
    return []; // Return empty array instead of throwing
  }
});

export const getCourseById = cache(
  async (courseId: string): Promise<Course | null> => {
    try {
      // First, let's get the course with its modules in a single query
      const rows = await sql<
        {
          // Course fields
          id: number;
          title: string;
          description: string | null;
          image_url: string | null;
          instructor_id: number | null;
          price: number | null;
          is_published: boolean;
          category_id: number | null;
          created_at: string;
          updated_at: string;
          // Module fields (prefixed to avoid name collisions)
          module_id: number | null;
          module_title: string | null;
          module_description: string | null;
          module_position: number | null;
          module_is_published: boolean | null;
          module_created_at: string | null;
          module_updated_at: string | null;
        }[]
      >`
        SELECT
          c.*,
          m.id AS module_id,
          m.title AS module_title,
          m.description AS module_description,
          m.position AS module_position,
          m.is_published AS module_is_published,
          m.created_at AS module_created_at,
          m.updated_at AS module_updated_at
        FROM
          courses c
          LEFT JOIN modules m ON c.id = m.course_id
        WHERE
          c.id = ${courseId}
        ORDER BY
          m.position ASC
      `;

      if (!rows.length) return null;

      // Since we're using LEFT JOIN, all rows will have course data
      // but module data might be null if there are no modules
      if (!rows[0]) return null;

      const course = {
        id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        image_url: rows[0].image_url,
        instructor_id: rows[0].instructor_id,
        price: rows[0].price,
        is_published: rows[0].is_published,
        category_id: rows[0].category_id,
        created_at: new Date(rows[0].created_at),
        updated_at: new Date(rows[0].updated_at),
        modules: rows[0].module_id ? [] : undefined, // Initialize modules array only if we have modules
      } as Course;

      // If we have modules, process them
      if (rows[0].module_id) {
        course.modules = rows
          .map((row) => ({
            id: row.module_id!,
            title: row.module_title!,
            description: row.module_description,
            position: row.module_position!,
            course_id: course.id,
            is_published: row.module_is_published!,
            is_free: row.module_is_published ? false : true, // Assuming is_free is derived from is_published
            created_at: new Date(row.module_created_at!),
            updated_at: new Date(row.module_updated_at!),
          }))
          .filter((module) => module.id !== null);
      }

      return course;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch course');
    }
  },
);

export const getCourseAttachments = cache(
  async (courseId: string): Promise<Attachment[]> => {
    try {
      const attachments = await sql<Attachment[]>`
        SELECT
          id,
          name,
          url,
          course_id,
          created_at,
          updated_at
        FROM
          attachments
        WHERE
          course_id = ${Number(courseId)}
      `;

      return attachments.map((attachment) => ({
        ...attachment,
        created_at: new Date(attachment.created_at),
        updated_at: new Date(attachment.updated_at),
      }));
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch course attachments');
    }
  },
);

export const createAttachment = cache(
  async (data: { url: string; name: string; courseId: number }) => {
    try {
      const [attachment] = await sql<Attachment[]>`
        INSERT INTO
          attachments (url, name, course_id)
        VALUES
          (
            ${data.url},
            ${data.name},
            ${data.courseId}
          )
        RETURNING
          *
      `;

      return attachment;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to create attachment');
    }
  },
);

export const deleteAttachment = cache(async (attachmentId: number) => {
  try {
    // verify the attachment exists
    const [attachment] = await sql`
      SELECT
        id,
        course_id
      FROM
        attachments
      WHERE
        id = ${attachmentId}
    `;

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    // Delete the attachment
    await sql`
      DELETE FROM attachments
      WHERE
        id = ${attachmentId}
    `;

    return attachment;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete attachment');
  }
});

export const publishCourse = cache(
  async (courseId: string): Promise<Course | null> => {
    try {
      // First verify there is at least one published module
      const [{ count }] = await sql<[{ count: number }]>`
        SELECT
          count(*)::int
        FROM
          modules
        WHERE
          course_id = ${courseId}
          AND is_published = TRUE
      `;

      if (count === 0) {
        throw new Error('Cannot publish course without published modules');
      }

      const [updatedCourse] = await sql<Course[]>`
        UPDATE courses
        SET
          is_published = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${courseId}
          AND is_published = FALSE
        RETURNING
          *
      `;

      if (!updatedCourse) return null;

      return {
        ...updatedCourse,
        created_at: new Date(updatedCourse.created_at),
        updated_at: new Date(updatedCourse.updated_at),
      };
    } catch (error) {
      console.error('[PUBLISH_COURSE]', error);
      throw error;
    }
  },
);

export const unpublishCourse = cache(
  async (courseId: string): Promise<Course | null> => {
    try {
      const [updatedCourse] = await sql<Course[]>`
        UPDATE courses
        SET
          is_published = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${courseId}
        RETURNING
          *
      `;

      if (!updatedCourse) return null;

      return {
        ...updatedCourse,
        created_at: new Date(updatedCourse.created_at),
        updated_at: new Date(updatedCourse.updated_at),
      };
    } catch (error) {
      console.error('[UNPUBLISH_COURSE]', error);
      throw new Error('Failed to unpublish course');
    }
  },
);

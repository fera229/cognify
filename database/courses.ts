import { cache } from 'react';
import { sql } from './connect';
import { Attachment, Category, Course } from '@/util/types';
import { CourseFormData } from '@/util/validation';

export const getCourses = cache(async (): Promise<Course[]> => {
  try {
    const courses = await sql<Course[]>`
      SELECT
        id,
        title,
        description,
        instructor_id,
        price,
        is_published,
        category_id,
        created_at,
        updated_at
      FROM
        courses
      ORDER BY
        created_at DESC
    `;

    return courses;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch courses');
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

    return categories?.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories');
  }
});

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

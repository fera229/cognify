import { cache } from 'react';
import { sql } from './connect';
import { Category, Course } from '@/util/types';
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
      const [row] = await sql<
        {
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
        }[]
      >`
        SELECT
          *
        FROM
          courses
        WHERE
          id = ${courseId}
      `;

      if (!row) return null;

      // Map the row to the Course type
      const course: Course = {
        ...row,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      };

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

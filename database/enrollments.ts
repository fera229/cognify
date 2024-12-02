import { sql } from '@/database/connect';
import { cache } from 'react';
import type { Course } from '@/util/types';

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  is_paid: boolean;
  enrollment_date: Date;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

// Create a pending enrollment
export const createEnrollment = cache(
  async (userId: number, courseId: number): Promise<Enrollment> => {
    // First check if enrollment exists
    const [existingEnrollment] = await sql<Enrollment[]>`
      SELECT
        *
      FROM
        enrollments
      WHERE
        user_id = ${userId}
        AND course_id = ${courseId}
    `;

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const [enrollment] = await sql<Enrollment[]>`
      INSERT INTO
        enrollments (user_id, course_id)
      VALUES
        (
          ${userId},
          ${courseId}
        )
      RETURNING
        *
    `;

    if (!enrollment) {
      throw new Error('Failed to create enrollment');
    }

    return {
      ...enrollment,
      enrollment_date: new Date(enrollment.enrollment_date),
    };
  },
);

// Mark enrollment as paid
export const markEnrollmentAsPaid = cache(
  async (userId: number, courseId: number): Promise<Enrollment> => {
    const [enrollment] = await sql<Enrollment[]>`
      UPDATE enrollments
      SET
        is_paid = TRUE
      WHERE
        user_id = ${userId}
        AND course_id = ${courseId}
      RETURNING
        *
    `;

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    return {
      ...enrollment,
      enrollment_date: new Date(enrollment.enrollment_date),
    };
  },
);

// Check if user has paid access to a course
export const hasAccessToCourse = cache(
  async (userId: number, courseId: number): Promise<boolean> => {
    const [result] = await sql<[{ exists: boolean }]>`
      SELECT
        EXISTS (
          SELECT
            1
          FROM
            enrollments
          WHERE
            user_id = ${userId}
            AND course_id = ${courseId}
            -- AND is_paid = TRUE  -- Uncomment this line after activating payments in stripe dashboard
        )
    `;

    return result?.exists || false;
  },
);

// Get all paid courses for a user
export const getUserPaidCourses = cache(
  async (userId: number): Promise<EnrollmentWithCourse[]> => {
    const enrollments = await sql<EnrollmentWithCourse[]>`
      SELECT
        e.*,
        c.title AS course_title,
        c.description AS course_description,
        c.image_url AS course_image_url,
        c.instructor_id,
        c.price,
        c.is_published,
        c.category_id
      FROM
        enrollments e
        JOIN courses c ON c.id = e.course_id
      WHERE
        e.user_id = ${userId}
        AND e.is_paid = TRUE
      ORDER BY
        e.enrollment_date DESC
    `;

    return enrollments.map((enrollment) => ({
      ...enrollment,
      enrollment_date: new Date(enrollment.enrollment_date),
    }));
  },
);

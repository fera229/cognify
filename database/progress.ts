import { cache } from 'react';
import { sql } from '@/database/connect';

export const getCourseProgress = cache(
  async (
    userId: number,
    courseId: number,
  ): Promise<{
    completedLessons: number;
    totalLessons: number;
    percentageComplete: number;
  } | null> => {
    try {
      const [progress] = await sql<
        [
          {
            completed_lessons: BigInt;
            total_lessons: BigInt;
          },
        ]
      >`
        WITH
          course_lessons AS (
            SELECT
              l.id
            FROM
              lessons l
              JOIN modules m ON m.id = l.module_id
            WHERE
              m.course_id = ${courseId}
              AND l.is_published = TRUE
          ),
          completed_lessons AS (
            SELECT
              up.lesson_id
            FROM
              user_progress up
              JOIN course_lessons cl ON cl.id = up.lesson_id
            WHERE
              up.user_id = ${userId}
              AND up.is_completed = TRUE
          )
        SELECT
          count(DISTINCT cl.lesson_id) AS completed_lessons,
          (
            SELECT
              count(*)
            FROM
              course_lessons
          ) AS total_lessons
        FROM
          completed_lessons cl;
      `;

      if (!progress || Number(progress.total_lessons) === 0) {
        return null;
      }
      const completedLessons = Number(progress.completed_lessons);
      const totalLessons = Number(progress.total_lessons);
      return {
        completedLessons,
        totalLessons,
        percentageComplete: Math.round((completedLessons / totalLessons) * 100),
      };
    } catch (error) {
      console.error('[GET_COURSE_PROGRESS]', error);
      return null;
    }
  },
);

// Helper to get progress for multiple courses at once
export const getMultipleCoursesProgress = cache(
  async (userId: number, courseIds: number[]) => {
    try {
      const progressPromises = courseIds.map((courseId) =>
        getCourseProgress(userId, courseId),
      );

      const progressResults = await Promise.all(progressPromises);

      // Create a map of courseId to progress
      const progressMap = new Map();
      courseIds.forEach((courseId, index) => {
        progressMap.set(courseId, progressResults[index]);
      });

      return progressMap;
    } catch (error) {
      console.error('[GET_MULTIPLE_COURSES_PROGRESS]', error);
      return new Map();
    }
  },
);

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/database/users';
import { getCategories } from '@/database/courses';
import ProfilePage from './_components/profile-page';
import { hasAccessToCourse } from '@/database/enrollments';
import { getMultipleCoursesProgress } from '@/database/progress';
import { sql } from '@/database/connect';
import type { Course } from '@/util/types';

async function ProfilePageContent() {
  const user = await getUserFromSession();

  if (!user) {
    return redirect('/login');
  }

  try {
    // Get user's enrolled courses using SQL for efficient retrieval
    const enrolledCoursesRaw = await sql<
      (Course & { enrollment_date: Date })[]
    >`
      SELECT DISTINCT
        c.*,
        e.enrollment_date
      FROM
        courses c
        JOIN enrollments e ON e.course_id = c.id
      WHERE
        e.user_id = ${user.id}
      ORDER BY
        e.enrollment_date DESC
    `;

    // Format the courses to match the Course type
    const enrolledCourses: Course[] = enrolledCoursesRaw.map((course) => ({
      ...course,
      created_at: new Date(course.created_at),
      updated_at: new Date(course.updated_at),
    }));

    // Get categories for course cards
    const categories = await getCategories();

    // Get course progress for enrolled courses
    const courseIds = enrolledCourses.map((course) => course.id);
    const courseProgress =
      courseIds.length > 0
        ? await getMultipleCoursesProgress(user.id, courseIds)
        : new Map();

    // Get access status for all courses
    const accessPromises = courseIds.map((courseId) =>
      hasAccessToCourse(user.id, courseId),
    );
    const accessResults = await Promise.all(accessPromises);
    const coursesAccess = new Map(
      courseIds.map((courseId, index) => [
        courseId,
        accessResults[index] || false,
      ]),
    );

    return (
      <ProfilePage
        user={user}
        enrolledCourses={enrolledCourses}
        categories={categories}
        courseProgress={courseProgress}
        coursesAccess={coursesAccess}
      />
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    return (
      <div className="p-6">
        <p className="text-red-500">
          Something went wrong loading your profile. Please try again later.
        </p>
      </div>
    );
  }
}

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

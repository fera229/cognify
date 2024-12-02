import { getTeacherCourses } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { redirect } from 'next/navigation';
import TeacherCoursesPage from './[courseId]/_components/teacher-courses-page';

export default async function CoursesPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect('/login');
  }

  const courses = await getTeacherCourses(user.id);
  return <TeacherCoursesPage courses={courses} />;
}

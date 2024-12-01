import { Suspense } from 'react';
import { sql } from '@/database/connect';
import { CourseSidebar } from './_components/course-sidebar';
import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/database/users';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserNavMenu from '@/app/(dashboard)/_components/user-nav-menu';
import { getCourseById } from '@/database/courses';
import { getCourseModules } from '@/database/modules';
import { getLessonsByModuleId } from '@/database/lessons';

interface CourseLayoutProps {
  children: React.ReactNode;
  params: { courseId: string };
}

// Separate component for navbar to keep the layout clean
const CourseNavbar = ({ user }: { user: any }) => {
  return (
    <div className="p-4 h-full flex items-center bg-white border-b shadow-sm">
      <Link
        href="/search"
        className="flex items-center hover:opacity-75 transition gap-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to browse</span>
      </Link>
      <div className="ml-auto">
        <UserNavMenu user={user} />
      </div>
    </div>
  );
};

// Function to fetch course with its modules and lessons
async function getFullCourseData(courseId: string) {
  const course = await getCourseById(courseId);

  if (!course) {
    return null;
  }

  // Fetch modules
  const modules = await getCourseModules(courseId);

  // Fetch lessons for each module
  const modulesWithLessons = await Promise.all(
    modules.map(async (module) => {
      const lessons = await getLessonsByModuleId(module.id.toString());
      return {
        ...module,
        lessons: lessons || [],
      };
    }),
  );

  return {
    ...course,
    modules: modulesWithLessons,
  };
}

async function CourseLayoutContent({ children, params }: CourseLayoutProps) {
  const user = await getUserFromSession();
  const paramsAwaited = await params;
  if (!user) {
    return redirect('/login');
  }

  const courseData = await getFullCourseData(paramsAwaited.courseId);

  if (!courseData) {
    return redirect('/');
  }

  // Only allow access to published courses unless user is the instructor
  if (!courseData.is_published && courseData.instructor_id !== user.id) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      {/* Fixed navbar at top */}
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <CourseNavbar user={user} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-40 pt-[80px]">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <CourseSidebar
            course={courseData}
            progressCount={0} // You can implement progress tracking here
          />
        </Suspense>
      </div>

      {/* Main content area with offset for navbar and sidebar */}
      <div className="md:pl-80 pt-[80px] h-full">
        <div className="h-full">
          <Suspense fallback={<div>Loading content...</div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
  return (
    <Suspense fallback={<div>Loading course...</div>}>
      <CourseLayoutContent params={params}>{children}</CourseLayoutContent>
    </Suspense>
  );
}

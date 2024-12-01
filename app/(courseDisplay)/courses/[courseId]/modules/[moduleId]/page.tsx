import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCourseById } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { getModuleById } from '@/database/modules';
import ModuleContent from './_components/module-content';
interface ModulePageProps {
  params: {
    courseId: string;
    moduleId: string;
  };
}

async function ModulePageContent({ params }: ModulePageProps) {
  try {
    const paramsAwaited = await params;
    const [user, course, module] = await Promise.all([
      getUserFromSession(),
      getCourseById(paramsAwaited.courseId),
      getModuleById(paramsAwaited.moduleId),
    ]);

    if (!user) {
      return redirect('/login');
    }

    if (!course || !module) {
      return redirect('/');
    }

    const isInstructor = course.instructor_id === user.id;

    // Check if module belongs to course
    if (module.course_id !== Number(paramsAwaited.courseId)) {
      return redirect(`/courses/${paramsAwaited.courseId}`);
    }

    // For non-instructors, check if module is accessible
    if (!isInstructor && !module.is_published && !module.is_free) {
      return redirect(`/courses/${paramsAwaited.courseId}`);
    }

    return (
      <div className="h-full">
        <ModuleContent
          module={module}
          course={course}
          user={user}
          isInstructor={isInstructor}
        />
      </div>
    );
  } catch (error) {
    console.error('Error in ModulePage:', error);
    return redirect('/');
  }
}

export default async function ModulePage(props: ModulePageProps) {
  return (
    <Suspense fallback={<div>Loading module...</div>}>
      <ModulePageContent {...props} />
    </Suspense>
  );
}

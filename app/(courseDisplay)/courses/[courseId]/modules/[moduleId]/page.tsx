import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getModuleById } from '@/database/modules';
import { getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import ModuleContent from './_components/module-content';

interface PageProps {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
}

async function ModulePageContent({ params }: PageProps) {
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

    // redirect if the course doesn't exist or the user is not the creator of the course
    if (!course || user.id !== course?.instructor_id) {
      return redirect('/');
    }

    if (!module) {
      return redirect('/');
    }

    return (
      <div className="h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <ModuleContent
            module={module}
            course={course}
            user={user}
            isInstructor={course.instructor_id === user.id}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading module:', error);
    return redirect('/');
  }
}

export default async function ModuleEditPage(props: PageProps) {
  return (
    <Suspense fallback={<div>Loading module...</div>}>
      {/* @ts-expect-error Async Server Component */}
      <ModulePageContent {...props} />
    </Suspense>
  );
}

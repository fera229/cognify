import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCourseById } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { getModuleById } from '@/database/modules';
import { getLessonById } from '@/database/lessons';
import LessonContent from './_components/lesson-content';
import AILessonAssistant from './_components/ai-lesson-assistant';
import { hasAccessToCourse } from '@/database/enrollments';

interface LessonPageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

async function LessonPageContent({ params }: LessonPageProps) {
  try {
    const paramsAwaited = await params;

    const [user, course, module, lesson] = await Promise.all([
      getUserFromSession(),
      getCourseById(paramsAwaited.courseId),
      getModuleById(paramsAwaited.moduleId),
      getLessonById(paramsAwaited.lessonId),
    ]);

    if (!user) {
      return redirect('/login');
    }

    if (!course || !module || !lesson) {
      return redirect('/');
    }

    const isInstructor = course.instructor_id === user.id;

    // Check course access if not instructor
    let hasAccess = isInstructor;
    if (!isInstructor) {
      hasAccess = await hasAccessToCourse(
        user.id,
        Number(paramsAwaited.courseId),
      );
    }

    // Determine if user can access this specific lesson
    const canAccessLesson = isInstructor || lesson.is_free || hasAccess;

    if (
      module.course_id !== Number(paramsAwaited.courseId) ||
      lesson.module_id !== Number(paramsAwaited.moduleId)
    ) {
      return redirect(`/courses/${paramsAwaited.courseId}`);
    }

    return (
      <div className="h-full relative">
        <LessonContent
          lesson={lesson}
          module={module}
          course={course}
          user={user}
          isInstructor={isInstructor}
          hasAccess={hasAccess}
          canAccessLesson={canAccessLesson}
        />
        <div>
          <AILessonAssistant />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in LessonPage:', error);
    return redirect('/');
  }
}

export default async function LessonPage(props: LessonPageProps) {
  return (
    <Suspense fallback={<div>Loading lesson...</div>}>
      <LessonPageContent {...props} />
    </Suspense>
  );
}

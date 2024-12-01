import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCourseById } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { getModuleById } from '@/database/modules';
import { getLessonById } from '@/database/lessons';
import LessonContent from './_components/lesson-content';
import AILessonAssistant from './_components/ai-lesson-assistant';
import { sql } from '@/database/connect';
import type { TranscriptSegment } from '@/util/types';

interface LessonPageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

async function getLessonTranscripts(
  lessonId: string,
): Promise<TranscriptSegment[]> {
  try {
    const [result] = await sql<{ transcript_segments: TranscriptSegment[] }[]>`
      SELECT
        transcript_segments
      FROM
        video_transcripts
      WHERE
        lesson_id = ${lessonId}
    `;
    return result?.transcript_segments || [];
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return [];
  }
}

async function LessonPageContent({ params }: LessonPageProps) {
  try {
    const paramsAwaited = await params;

    // Fetch all required data including transcripts
    const [user, course, module, lesson, transcripts] = await Promise.all([
      getUserFromSession(),
      getCourseById(paramsAwaited.courseId),
      getModuleById(paramsAwaited.moduleId),
      getLessonById(paramsAwaited.lessonId),
      getLessonTranscripts(paramsAwaited.lessonId),
    ]);

    if (!user) {
      return redirect('/login');
    }

    if (!course || !module || !lesson) {
      return redirect('/');
    }

    const isInstructor = course.instructor_id === user.id;

    // Verify relationships
    if (
      module.course_id !== Number(paramsAwaited.courseId) ||
      lesson.module_id !== Number(paramsAwaited.moduleId)
    ) {
      return redirect(`/courses/${paramsAwaited.courseId}`);
    }

    // Check access for non-instructors
    if (!isInstructor && !lesson.is_free && !module.is_published) {
      return redirect(
        `/courses/${paramsAwaited.courseId}/modules/${paramsAwaited.moduleId}`,
      );
    }

    return (
      <div className="h-full relative">
        <LessonContent
          lesson={lesson}
          module={module}
          course={course}
          user={user}
          isInstructor={isInstructor}
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

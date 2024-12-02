'use client';

import { useRouter } from 'next/navigation';
import type { Course, Module, Lesson } from '@/util/types';
import type { User } from '@/database/users';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Route } from 'next';
import MuxPlayer from '@mux/mux-player-react';
import { Banner } from '@/components/banner';
import CoursePurchaseButton from '@/components/course-purchase-button';
import Link from 'next/link';

interface LessonContentProps {
  lesson: Lesson;
  module: Module;
  course: Course;
  user: User;
  isInstructor: boolean;
  hasAccess: boolean;
  canAccessLesson: boolean;
}

export default function LessonContent({
  lesson,
  module,
  course,
  user,
  isInstructor,
  hasAccess,
  canAccessLesson,
}: LessonContentProps) {
  const router = useRouter();

  const currentLessonIndex =
    module.lessons?.findIndex((l) => l.id === lesson.id) ?? -1;
  const nextLesson = module.lessons?.[currentLessonIndex + 1];
  const previousLesson = module.lessons?.[currentLessonIndex - 1];

  const getNavigationRoute = (lessonId: number): Route => {
    return `/courses/${course.id}/modules/${module.id}/lessons/${lessonId}` as Route;
  };

  return (
    <>
      {/* Access Warning */}
      {!lesson.is_published && (
        <Banner
          label="This lesson is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}
      {!canAccessLesson && (
        <Banner
          label="This lesson is premium content. Purchase the course to unlock it."
          variant="warning"
        />
      )}
      {/* Navigation */}
      <div className="mt-4 ml-2">
        <Link
          href={`/courses/${course.id}/modules/${module.id}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to module
        </Link>
      </div>

      <div className="flex-1 p-6 pt-0 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 mb-8">
            <Badge className="w-fit">Lesson {currentLessonIndex + 1}</Badge>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-muted-foreground">{lesson.description}</p>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {/* Video Content */}
          {canAccessLesson ? (
            lesson.video_url && (
              <div className="relative aspect-video mb-8">
                <MuxPlayer
                  playbackId={lesson.video_url}
                  metadata={{
                    video_id: lesson.id.toString(),
                    video_title: lesson.title,
                  }}
                />
              </div>
            )
          ) : (
            <>
              {!hasAccess && !isInstructor && (
                <div className="mt-8 flex items-center justify-center">
                  <CoursePurchaseButton
                    courseId={course.id}
                    price={course.price}
                    hasAccess={hasAccess}
                  />
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {previousLesson &&
            (canAccessLesson || previousLesson.is_free || isInstructor) ? (
              <Button
                onClick={() =>
                  router.push(getNavigationRoute(previousLesson.id))
                }
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
            ) : (
              <div>{/* Empty div for spacing */}</div>
            )}

            {nextLesson &&
              (canAccessLesson || nextLesson.is_free || isInstructor) && (
                <Button
                  onClick={() => router.push(getNavigationRoute(nextLesson.id))}
                >
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

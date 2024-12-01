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

interface LessonContentProps {
  lesson: Lesson;
  module: Module;
  course: Course;
  user: User;
  isInstructor: boolean;
}

export default function LessonContent({
  lesson,
  module,
  course,
  user,
  isInstructor,
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
    <div className="flex-1 p-6 max-w-5xl mx-auto">
      {/* Navigation */}
      <Button
        variant="ghost"
        onClick={() =>
          router.push(`/courses/${course.id}/modules/${module.id}` as Route)
        }
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to module
      </Button>

      {lesson.is_free ? (
        <>
          {/* Header */}
          <div className="flex flex-col gap-2 mb-8">
            <Badge className="w-fit">Lesson {currentLessonIndex + 1}</Badge>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-muted-foreground">{lesson.description}</p>
            )}
          </div>

          {/* Video Content */}
          {lesson.video_url && (
            <div className="relative aspect-video mb-8">
              <MuxPlayer
                playbackId={lesson.video_url}
                metadata={{
                  video_id: lesson.id.toString(),
                  video_title: lesson.title,
                }}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {previousLesson && (isInstructor || previousLesson.is_free) ? (
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

            {nextLesson && (isInstructor || nextLesson.is_free) && (
              <Button
                onClick={() => router.push(getNavigationRoute(nextLesson.id))}
              >
                Next Lesson
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <Banner label="This lesson is premium. Please purchase the course to unlock it." />
      )}
    </div>
  );
}

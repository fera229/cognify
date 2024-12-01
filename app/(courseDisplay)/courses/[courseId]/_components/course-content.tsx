'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Course } from '@/util/types';
import type { User } from '@/database/users';
import { Button } from '@/components/ui/button';
import { BookOpen, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Route } from 'next';

interface CourseContentProps {
  course: Course;
  user: User;
  isInstructor: boolean;
}

export default function CourseContent({
  course,
  user,
  isInstructor,
}: CourseContentProps) {
  const router = useRouter();

  // Safely get the first available lesson
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];

  // Only allow start if we have both a module and lesson
  const canStart = Boolean(firstModule && firstLesson);

  const handleStartCourse = () => {
    if (canStart && firstModule && firstLesson) {
      const courseRoute =
        `/courses/${course.id}/modules/${firstModule.id}/lessons/${firstLesson.id}` as Route;
      router.push(courseRoute);
    }
  };

  // Helper function to safely get module lesson count
  const getLessonCount = (moduleId: number) => {
    const module = course.modules?.find((m) => m.id === moduleId);
    return module?.lessons?.length ?? 0;
  };

  // Helper function to generate type-safe lesson route
  const getLessonRoute = (moduleId: number, lessonId: number): Route => {
    return `/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}` as Route;
  };

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isInstructor
              ? 'You are viewing this course as the instructor'
              : 'Course Overview'}
          </p>
        </div>
        {!isInstructor && (
          <Button onClick={handleStartCourse} disabled={!canStart} size="lg">
            <BookOpen className="h-4 w-4 mr-2" />
            {canStart ? 'Start Course' : 'No lessons available'}
          </Button>
        )}
      </div>

      {/* Course Stats */}
      <div className="mt-8 flex gap-4">
        <div className="bg-slate-100 rounded-lg p-4">
          <h3 className="font-medium text-sm">Modules</h3>
          <p className="text-2xl font-bold">{course.modules?.length ?? 0}</p>
        </div>
        <div className="bg-slate-100 rounded-lg p-4">
          <h3 className="font-medium text-sm">Total Lessons</h3>
          <p className="text-2xl font-bold">
            {course.modules?.reduce(
              (total, module) => total + (module.lessons?.length ?? 0),
              0,
            ) ?? 0}
          </p>
        </div>
      </div>

      {/* Course description */}
      {course.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About this course</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </div>
      )}

      {/* Course structure */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        {!course.modules?.length ? (
          <div className="text-center p-8 bg-slate-100 rounded-lg">
            <p className="text-muted-foreground">No content available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    {!module.is_published && !isInstructor && (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getLessonCount(module.id)}{' '}
                    {getLessonCount(module.id) === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                {/* Lessons list */}
                {module.lessons && module.lessons.length > 0 ? (
                  <div className="ml-4 space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors"
                        onClick={() => {
                          if (isInstructor || lesson.is_free) {
                            router.push(getLessonRoute(module.id, lesson.id));
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        style={{
                          cursor:
                            isInstructor || lesson.is_free
                              ? 'pointer'
                              : 'default',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-6">
                            {lessonIndex + 1}.
                          </span>
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        {!lesson.is_free && !isInstructor && (
                          <Badge variant="outline" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground ml-4">
                    No lessons available in this module
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import type { Course, Module } from '@/util/types';
import type { User } from '@/database/users';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Route } from 'next';

interface ModuleContentProps {
  module: Module;
  course: Course;
  user: User;
  isInstructor: boolean;
}

export default function ModuleContent({
  module,
  course,
  user,
  isInstructor,
}: ModuleContentProps) {
  const router = useRouter();

  const firstLesson = module.lessons?.[0];
  const canStart = Boolean(firstLesson);

  const getLessonRoute = (lessonId: number): Route => {
    return `/courses/${course.id}/modules/${module.id}/lessons/${lessonId}` as Route;
  };

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto">
      {/* Navigation */}
      <Button
        variant="ghost"
        onClick={() => router.push(`/courses/${course.id}` as Route)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className="mb-2">Module</Badge>
          <h1 className="text-2xl font-bold">{module.title}</h1>
          {module.description && (
            <p className="mt-2 text-muted-foreground">{module.description}</p>
          )}
        </div>

        {!isInstructor && canStart && (
          <Button
            onClick={() =>
              firstLesson && router.push(getLessonRoute(firstLesson.id))
            }
            size="lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Start Module
          </Button>
        )}
      </div>

      {/* Lessons List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Module Lessons</h2>
        {!module.lessons?.length ? (
          <div className="text-center p-8 bg-slate-100 rounded-lg">
            <p className="text-muted-foreground">No lessons available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  if (isInstructor || lesson.is_free) {
                    router.push(getLessonRoute(lesson.id));
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-medium">{lesson.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {!lesson.is_free && !isInstructor && (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {lesson.video_url && <Badge variant="outline">Video</Badge>}
                  </div>
                </div>
                {lesson.description && (
                  <p className="mt-2 text-sm text-muted-foreground ml-9">
                    {lesson.description}
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

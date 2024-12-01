'use client';

import { cn } from '@/lib/utils';
import type { Course, Module, Lesson } from '@/util/types';
import { CourseSidebarItem } from './course-sidebar-item';
import Link from 'next/link';

interface CourseSidebarProps {
  course: Course & {
    modules: (Module & {
      lessons?: Lesson[];
    })[];
  };
  progressCount?: number;
}

export const CourseSidebar = ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  // Convert progressCount to a Set of completed lesson IDs for easier lookup
  const userProgress = {
    completedLessons: new Set<number>(),
  };

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white">
      <div className="p-8 flex flex-col border-b">
        <Link href={`/courses/${course.id}`}>
          <h2 className="font-semibold text-lg">{course.title}</h2>
        </Link>
        {progressCount !== undefined && (
          <div className="mt-2 flex items-center gap-x-2">
            <div className="text-sm text-slate-500">
              {progressCount}% Complete
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.modules
          .sort((a, b) => a.position - b.position)
          .map((module) => (
            <CourseSidebarItem
              key={module.id}
              module={{
                ...module,
                lessons: module.lessons || [], // Provide empty array as fallback
              }}
              courseId={course.id.toString()}
              userProgress={userProgress}
            />
          ))}
      </div>
    </div>
  );
};

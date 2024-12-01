'use client';

import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Module, Lesson } from '@/util/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CourseSidebarItemProps {
  module: Omit<Module, 'lessons'> & {
    lessons: Lesson[];
  };
  courseId: string;
  userProgress?: {
    completedLessons: Set<number>;
  };
}

const TruncatedText = ({ text }: { text: string }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="truncate flex-1 text-left cursor-pointer">
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[300px] break-words">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CourseSidebarItem = ({
  module,
  courseId,
  userProgress,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const isModuleActive = pathname?.includes(`/modules/${module.id}`);
  const hasCompletedLessons = module.lessons.some((lesson) =>
    userProgress?.completedLessons.has(lesson.id),
  );

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleExpand}
        className={cn(
          'flex w-full items-center text-slate-500 text-sm font-[500] pl-4 pr-2 transition-all hover:text-slate-600 hover:bg-slate-300/20',
          isModuleActive &&
            'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20',
          hasCompletedLessons && 'text-emerald-700 hover:text-emerald-700',
        )}
      >
        <div className="flex items-center py-4 min-w-0 flex-1">
          <div className="flex-shrink-0 mr-2">
            {module.is_published ? (
              hasCompletedLessons ? (
                <CheckCircle size={22} className="text-emerald-700" />
              ) : (
                <PlayCircle size={22} className="text-slate-500" />
              )
            ) : (
              <Lock size={22} className="text-slate-500" />
            )}
          </div>
          <TruncatedText text={module.title} />
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="pl-6">
          {module.lessons.map((lesson) => {
            const isLessonActive = pathname?.includes(`/lessons/${lesson.id}`);
            const isCompleted = userProgress?.completedLessons.has(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() =>
                  router.push(
                    `/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`,
                  )
                }
                className={cn(
                  'flex w-full items-center text-slate-500 text-sm font-[500] pl-4 pr-2 py-2 transition-all hover:text-slate-600 hover:bg-slate-300/20',
                  isLessonActive &&
                    'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20',
                  isCompleted && 'text-emerald-700 hover:text-emerald-700',
                )}
              >
                <div className="flex items-center min-w-0 w-full">
                  <div className="flex-shrink-0 mr-2">
                    {lesson.is_published ? (
                      isCompleted ? (
                        <CheckCircle size={18} className="text-emerald-700" />
                      ) : (
                        <PlayCircle size={18} className="text-slate-500" />
                      )
                    ) : (
                      <Lock size={18} className="text-slate-500" />
                    )}
                  </div>
                  <TruncatedText text={lesson.title} />
                  {lesson.is_free && (
                    <span className="flex-shrink-0 ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                      Free
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

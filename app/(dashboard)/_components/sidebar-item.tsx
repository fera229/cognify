import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';

interface LessonProgress {
  isCompleted: boolean;
  isLocked: boolean;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  //fix this❌
  href: any;
  isActive?: boolean;
  lessonProgress?: LessonProgress;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  lessonProgress,
}: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (!lessonProgress?.isLocked) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700 border-l-4 border-slate-700',
        lessonProgress?.isCompleted &&
          'text-emerald-700 hover:text-emerald-700',
        lessonProgress?.isLocked &&
          'opacity-50 cursor-not-allowed hover:bg-transparent',
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            'text-slate-500',
            isActive && 'text-slate-700',
            lessonProgress?.isCompleted && 'text-emerald-700',
          )}
        />
        {label}
      </div>
    </button>
  );
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/cofirm-modal';
import toast from 'react-hot-toast';

interface LessonActionsProps {
  disabled: boolean;
  courseId: string;
  moduleId: string;
  lessonId: string;
  isPublished: boolean;
}

export const LessonActions = ({
  disabled,
  courseId,
  moduleId,
  lessonId,
  isPublished,
}: LessonActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/publish`,
        {
          method: isPublished ? 'DELETE' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error('Failed to toggle publish status');

      toast.success(isPublished ? 'Lesson unpublished' : 'Lesson published');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) throw new Error('Failed to delete lesson');

      toast.success('Lesson deleted');
      router.refresh();
      router.push(`/teacher/courses/${courseId}/modules/${moduleId}`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

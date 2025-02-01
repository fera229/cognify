'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/cofirm-modal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
interface CourseActionsProps {
  courseId: string;
  isPublished: boolean;
  disabled?: boolean;
  isComplete: boolean;
}

export function CourseActions({
  courseId,
  isPublished,
  disabled,
  isComplete,
}: CourseActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success('Course deleted successfully');
      router.push('/teacher/courses');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/courses/${courseId}/${isPublished ? 'unpublish' : 'publish'}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(error.message);
      }
      {
        !isPublished &&
          confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 },
            colors: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
            ticks: 200,
            gravity: 1.2,
            decay: 0.94,
            startVelocity: 30,
          });
      }
      toast.success(isPublished ? 'Course unpublished' : 'Course published');

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmModalConfig = {
    title: 'Delete course',
    description:
      'This will permanently delete this course and all its content. This action cannot be undone.',
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading || (!isComplete && !isPublished)}
        variant="outline"
        size="sm"
        className="bg-slate-200 hover:bg-slate-300"
      >
        {isLoading ? 'Loading...' : isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirmAction={onDelete} {...confirmModalConfig}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/cofirm-modal';
import toast from 'react-hot-toast';
import type{ Lesson } from '@/util/types';

interface ModuleActionData {
  courseId: string;
  moduleId: string;
  is_published: boolean;
  lessons: Lesson[];
}

interface ModuleActionsProps {
  data: ModuleActionData;
  disabled?: boolean;
  isComplete?: boolean;
}

export function ModuleActions({
  data,
  disabled,
  isComplete,
}: ModuleActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if module has any published lessons
  const hasPublishedLessons = data.lessons.some(
    (lesson) => lesson.is_published,
  );

  const onPublish = async () => {
    try {
      setIsLoading(true);

      if (!data.is_published && !hasPublishedLessons) {
        toast.error('Publish at least one lesson first');
        return;
      }

      const endpoint = data.is_published ? 'unpublish' : 'publish';
      const response = await fetch(
        `/api/courses/${data.courseId}/modules/${data.moduleId}/${endpoint}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update module');
      }

      toast.success(
        data.is_published ? 'Module unpublished' : 'Module published',
      );
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/courses/${data.courseId}/modules/${data.moduleId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success('Module deleted');
      router.push(`/teacher/courses/${data.courseId}`);
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={
          disabled ||
          isLoading ||
          !isComplete ||
          (!data.is_published && !hasPublishedLessons)
        }
        variant="outline"
        size="sm"
        className="bg-slate-200 hover:bg-slate-300"
      >
        {isLoading ? 'Loading...' : data.is_published ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal
        onConfirmAction={onDelete}
        title="Delete module"
        description="This will permanently delete this module and all its lessons."
      >
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

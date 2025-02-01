'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/cofirm-modal';
import toast from 'react-hot-toast';

interface LessonActionData {
  courseId: string;
  lessonId: string;
  moduleId: string;
  is_published: boolean;
}

interface LessonsActionsProps {
  data: LessonActionData;
  disabled?: boolean;
  isComplete?: boolean;
}

export function LessonsActions({
  data,
  disabled,
  isComplete,
}: LessonsActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);
      console.log('Starting lesson publish action:', {
        currentState: data.is_published,
      });

      if (!data.is_published) {
        const response = await fetch(
          `/api/courses/${data.courseId}/modules/${data.moduleId}/lessons/${data.lessonId}/publish`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to update lesson');
        }
      } else {
        const response = await fetch(
          `/api/courses/${data.courseId}/modules/${data.moduleId}/lessons/${data.lessonId}/unpublish`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to update lesson');
        }
      }

      toast.success(
        data.is_published ? 'Lesson unpublished' : 'Lesson published',
      );

      router.refresh();
    } catch (error) {
      console.error('Publish action failed:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/courses/${data.courseId}/modules/${data.moduleId}/lessons/${data.lessonId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success('Lesson deleted successfully');
      router.push(`/teacher/courses/${data.courseId}/modules/${data.moduleId}`);
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
        disabled={disabled || isLoading || !isComplete}
        variant="outline"
        size="sm"
        className="bg-slate-200 hover:bg-slate-300"
      >
        {isLoading ? 'Loading...' : data.is_published ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal
        onConfirmAction={onDelete}
        title="Delete lesson"
        description="This will permanently delete this lesson and its content."
      >
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

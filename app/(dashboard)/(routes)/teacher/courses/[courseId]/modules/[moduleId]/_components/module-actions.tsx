'use client';

import { ConfirmModal } from '@/components/modals/cofirm-modal';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ModuleActionsProps {
  disabled: boolean;
  moduleId: number;
  courseId: number;
  isPublished: boolean;
}

export default function ModuleActions({
  disabled,
  moduleId,
  courseId,
  isPublished,
}: ModuleActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      toast.success('Module deleted');
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} variant="destructive" size="sm">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Lesson } from '@/util/types';
import MuxPlayer from '@mux/mux-player-react';

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export const LessonVideoForm = ({
  initialData,
  courseId,
  moduleId,
  lessonId,
}: LessonVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: { video_url: string }) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) throw new Error('Failed to update lesson video');

      toast.success('Lesson video updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData.video_url ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit video
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add video
                </>
              )}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.video_url ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.video_url}
              metadata={{
                video_id: initialData.id.toString(),
                video_title: initialData.title,
              }}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          {/* implement video upload functionality here */}
          <p className="text-xs text-muted-foreground mt-4">
            Upload your lesson video
          </p>
        </div>
      )}
    </div>
  );
};

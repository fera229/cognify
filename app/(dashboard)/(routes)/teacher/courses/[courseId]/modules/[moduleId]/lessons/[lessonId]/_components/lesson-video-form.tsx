'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { FileUpload } from '@/components/uploadFile';
import { Pencil, PlusCircle, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/util/types';
import toast from 'react-hot-toast';
import MuxPlayer from '@mux/mux-player-react';
import { Progress } from '@/components/ui/progress';

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  moduleId: string;
  lessonId: string;
}

const videoSchema = z.object({
  video_url: z.string().url('Invalid video URL'),
  playback_id: z.string(),
  duration: z.number().min(0),
});

export const LessonVideoForm = ({
  initialData,
  courseId,
  moduleId,
  lessonId,
}: LessonVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const toggleEdit = useCallback(() => {
    setIsEditing((current) => !current);
    setUploadProgress(0);
  }, []);

  const onSubmit = useCallback(
    async (values: z.infer<typeof videoSchema>) => {
      try {
        setIsUploading(true);

        const response = await fetch(
          `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              video_url: values.playback_id,
              duration: values.duration,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update lesson');
        }

        toast.success('Video uploaded successfully');
        toggleEdit();
        router.refresh();
      } catch (error) {
        toast.error('Something went wrong');
        console.error(error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [courseId, moduleId, lessonId, router, toggleEdit],
  );

  const onVideoUpload = useCallback(
    async (url?: string) => {
      if (!url) {
        toast.error('No video URL provided');
        return;
      }

      try {
        setUploadProgress(25);

        const response = await fetch('/api/mux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoUrl: url,
            lessonId,
          }),
        });

        setUploadProgress(50);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to process video');
        }

        const data = await response.json();
        setUploadProgress(75);

        // Check the structure of the response based on our updated Mux route
        if (!data.asset?.playbackId || !data.asset?.id) {
          throw new Error('Missing required data from Mux response');
        }

        await onSubmit({
          video_url: url,
          playback_id: data.asset.playbackId,
          duration: data.asset.duration || 0,
        });

        setUploadProgress(100);
      } catch (error) {
        console.error('Video upload error:', error);
        toast.error(
          error instanceof Error ? error.message : 'Error uploading video',
        );
      }
    },
    [lessonId, onSubmit],
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson video
        <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData.video_url ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Change video
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

      {!isEditing && (
        <>
          {!initialData.video_url ? (
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
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload endpoint="lessonVideo" action={onVideoUpload} />
          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex items-center justify-center mt-2 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-slate-500">
                  {uploadProgress === 100
                    ? 'Finalizing...'
                    : `Processing: ${uploadProgress}%`}
                </p>
              </div>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-4">
            Upload your lesson video
          </div>
        </div>
      )}
    </div>
  );
};

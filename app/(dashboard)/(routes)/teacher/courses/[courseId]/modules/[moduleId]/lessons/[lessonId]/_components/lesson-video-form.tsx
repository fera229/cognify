'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { FileUpload } from '@/components/uploadFile';
import { Pencil, PlusCircle, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lesson, MuxData } from '@/util/types';
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
  asset_id: z.string(),
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

        console.log('Submitting video data:', values);

        const response = await fetch(
          `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              video_url: values.playback_id,
              duration: values.duration,
              muxData: {
                asset_id: values.asset_id,
                playback_id: values.playback_id,
              },
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Submission error:', errorData);
          throw new Error(errorData.message || 'Failed to update lesson video');
        }

        const responseData = await response.json();
        console.log('Submission successful:', responseData);

        toast.success('Video uploaded successfully');
        toggleEdit();
        router.refresh();
      } catch (error) {
        console.error('Submission error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong uploading the video',
        );
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

      console.log('Starting video upload with URL:', url);
      console.log('Lesson ID:', lessonId);

      // Simulate progress while processing
      const simulateProgress = () => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      };
      const progressInterval = setInterval(simulateProgress, 500);

      // Process the video upload
      try {
        const muxResponse = await fetch('/api/mux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            videoUrl: url,
          }),
        });

        if (!muxResponse.ok) {
          const errorData = await muxResponse.json();
          console.error('Mux API Error:', errorData);
          throw new Error(errorData.message || 'Failed to process video');
        }

        const data: MuxData = await muxResponse.json();
        console.log('Mux processing successful:', data);
        setUploadProgress(100);

        // Ensure we have the required data before submitting
        if (!data.asset_id || !data.playback_id) {
          throw new Error('Missing required data from Mux response');
        }

        await onSubmit({
          video_url: url,
          asset_id: data.asset_id,
          playback_id: data.playback_id,
          duration: initialData.duration || 0,
        });
      } catch (error) {
        console.error('Video processing error:', error);
        toast.error(
          error instanceof Error ? error.message : 'Error processing video',
        );
        setUploadProgress(0);
      } finally {
        clearInterval(progressInterval);
      }
    },
    [onSubmit, lessonId, initialData.duration],
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course video
        <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
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
                    ? 'Processing video...'
                    : `Uploading: ${uploadProgress}%`}
                </p>
              </div>
            </div>
          )}
          <div className="text-xs text-slate-500 mt-4">
            Upload your lesson video. Videos are processed for optimal playback.
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonVideoForm;

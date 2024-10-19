'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileUpload } from '@/components/uploadFile';

export interface ImageFormProps {
  initialData: { image_url?: string | null };
  courseId: number;
}

const formSchema = z.object({
  image_url: z.string().min(1, { message: 'Image is required.' }),
});

function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting values:', values);
      console.log('Course ID:', courseId);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ image_url: values.image_url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      const updatedCourse = await response.json();
      console.log('Updated course:', updatedCourse);

      toast.success('Course updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update image');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData?.image_url && (
            <>
              <PlusCircle className="h-4 w-4 m-2" />
              Add image
            </>
          )}

          {!isEditing && initialData?.image_url && (
            <>
              <Pencil className="h-4 w-4 m-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.image_url ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 ">
            <Image
              src={initialData.image_url}
              alt="Course image upload"
              fill
              className="rounded-md"
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ image_url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;

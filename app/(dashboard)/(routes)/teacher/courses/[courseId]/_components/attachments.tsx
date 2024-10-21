'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { File, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/uploadFile';
import { Attachment, Course } from '@/util/types';
import Link from 'next/link';

export interface AttachmentFormProps {
  initialData: { course: Course; attachments?: Attachment[] };
  courseId: number;
}

const formSchema = z.object({
  url: z.string().url(),
});

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting values:', values);
      console.log('Course ID:', courseId);
      const response = await fetch(`/api/courses/${courseId}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ attachments: values.url }),
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
      <div className="font-medium flex items-center justify-between mb-3">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 m-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments?.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}

          {initialData?.attachments && initialData.attachments.length > 0 && (
            <>
              <div className="space-y-2 ">
                {initialData.attachments.map((attachment) => (
                  <div key={attachment.id} className="space-y-2">
                    <Link href={{ pathname: attachment.url }}>
                      <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md ">
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p className="text-xs line-clamp-1">
                          {attachment.name}
                        </p>
                        {/* continue the attachment delete UI functionality and api route for delete request */}
                        <X className="h-4 w-4 text-slate-500 ml-auto" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {initialData?.attachments && initialData.attachments.length > 0 && (
            <div className="relative aspect-video mt-2"></div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Any any usefull recources that might help your students.
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentForm;

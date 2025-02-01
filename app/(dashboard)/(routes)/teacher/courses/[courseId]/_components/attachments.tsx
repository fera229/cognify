'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { File, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { Attachment, Course } from '@/util/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/uploadFile';
import Link from 'next/link';

export interface AttachmentFormProps {
  initialData: { course: Course; attachments?: Attachment[] };
  courseId: number;
}

const formSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1, 'Name is required'),
});

interface FileDetails {
  url: string;
  name: string;
}

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileDetails | null>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [deletingAttId, setDeletingAttId] = useState<Number | null>(null);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setSelectedFile(null);
    setAttachmentName('');
  };

  const handleFileSelected = (url?: string) => {
    if (!url) {
      toast.error('No file URL provided');
      return;
    }

    // Get default name from URL
    const defaultName = url.split('/').pop() || 'Unnamed attachment';
    setSelectedFile({ url, name: defaultName });
    setAttachmentName(defaultName);
    setShowNameDialog(true);
  };

  const handleAttNameSubmit = async () => {
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    try {
      const values = formSchema.parse({
        url: selectedFile.url,
        name: attachmentName,
      });

      const response = await fetch(`/api/courses/${courseId}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          attachments: values.url,
          name: values.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      toast.success('Attachment added successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast.error('Failed to add attachment');
    } finally {
      setShowNameDialog(false);
      setSelectedFile(null);
      setAttachmentName('');
    }
  };

  const onDeleteAttachment = async (attachmentId: number) => {
    setDeletingAttId(attachmentId);

    try {
      const response = await fetch(
        `/api/courses/${courseId}/attachments/${attachmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete attachment');
      }

      toast.success('Attachment deleted');
      router.refresh();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Failed to delete attachment');
    } finally {
      setDeletingAttId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
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
            <div className="space-y-2 mt-2">
              {initialData.attachments.map((attachment) => (
                <div className="space-y-2" key={attachment.id}>
                  <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <Link href={{ pathname: attachment.url }}>
                      <p className="text-xs line-clamp-1">{attachment.name}</p>
                    </Link>

                    {deletingAttId === attachment.id && (
                      <div>
                        <Loader2 className="animate-spin h-4 w-4 ml-auto text-slate-500" />
                      </div>
                    )}
                    {deletingAttId !== attachment.id && (
                      <button
                        className="ml-auto hover:opacity-50 transition"
                        onClick={() => onDeleteAttachment(attachment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload endpoint="courseAttachment" action={handleFileSelected} />
          <div className="text-xs text-muted-foreground mt-4">
            Add any useful resources that might help your students.
          </div>
        </div>
      )}

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your attachment</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (attachmentName.trim()) {
                handleAttNameSubmit();
              }
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Input
                  id="name"
                  placeholder="Enter attachment name"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNameDialog(false);
                  setSelectedFile(null);
                  setAttachmentName('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!attachmentName.trim()}>
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AttachmentForm;

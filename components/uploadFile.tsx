'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  action: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ action, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const url = res?.[0]?.url;
        if (url) {
          action(url);
        } else {
          toast.error('Failed to upload file');
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`) ||
          toast.error('Failed to upload file');
      }}
    />
  );
};

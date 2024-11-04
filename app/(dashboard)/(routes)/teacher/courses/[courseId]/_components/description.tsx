'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Editor from '@/components/text-editor';

export interface DescriptionFormProps {
  initialData: { description: string };
  courseId: number;
  entityId: number;
  entityType: 'course' | 'module';
}

const formSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
});

function DescriptionForm({
  initialData,
  courseId,
  entityId,
  entityType,
}: DescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url =
        entityType === 'course'
          ? `/api/courses/${entityId}`
          : `/api/courses/${courseId}/modules/${entityId}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description: values.description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update description');
      }

      const updatedEntity = await response.json();
      toast.success(
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated successfully`,
      );
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error updating description:', error);
      toast.error(`Failed to update ${entityType} description`);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {entityType === 'course' ? 'Course description' : 'Module description'}
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 m-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic',
          )}
          dangerouslySetInnerHTML={{
            __html: initialData.description || 'No description provided.',
          }}
        />
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor
                      onChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default DescriptionForm;

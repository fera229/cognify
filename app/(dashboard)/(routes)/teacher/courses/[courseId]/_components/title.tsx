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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface TitleFormProps {
  initialData: { title: string };
  courseId: number;
  entityId: number;
  entityType: 'course' | 'module' | 'lesson';
  moduleId?: number; // Only required for lessons
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
});

function TitleForm({
  initialData,
  courseId,
  entityId,
  entityType,
  moduleId,
}: TitleFormProps) {
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
      let url;
      switch (entityType) {
        case 'course':
          url = `/api/courses/${entityId}`;
          break;
        case 'module':
          url = `/api/courses/${courseId}/modules/${entityId}`;
          break;
        case 'lesson':
          url = `/api/courses/${courseId}/modules/${moduleId}/lessons/${entityId}`;
          break;
        default:
          throw new Error('Invalid entity type');
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: values.title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update ${entityType}`);
      }

      toast.success(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } updated successfully`,
      );
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      toast.error(`Failed to update ${entityType} title`);
    }
  };

  const labelText =
    entityType === 'course'
      ? 'Course title'
      : entityType === 'module'
        ? 'Module title'
        : 'Lesson title';

  const placeholderText =
    entityType === 'course'
      ? 'e.g. "Introduction to Computer Science"'
      : entityType === 'module'
        ? 'e.g. "Module 1 | How to get the best out of this course"'
        : 'e.g. "Lesson 1 | Introduction to the topic"';

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {labelText}
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 m-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New title</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder={placeholderText}
                      {...field}
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

export default TitleForm;

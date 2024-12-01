'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

import type { Category } from '@/util/types';
import { Combobox } from '@/components/ui/combobox';

export interface CategoryFormProps {
  initialData: { category_id?: string | null };
  courseId: number;
  categories: Category[];
}

const formSchema = z.object({
  category_id: z.string().min(1, { message: 'Category is required.' }),
});

function CategoryForm({
  initialData,
  courseId,
  categories,
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: initialData?.category_id || '',
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category_id: values.category_id ? Number(values.category_id) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      toast.success('Course updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update category');
    }
  };

  const selectedCategory = categories.find(
    (category) => category.value === initialData.category_id,
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Category
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 m-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.category_id && 'text-slate-500 italic',
          )}
        >
          {selectedCategory?.label || 'No category provided.'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Combobox
                    options={categories?.map((category) => ({
                      label: category.label,
                      value: category.value,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
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

export default CategoryForm;

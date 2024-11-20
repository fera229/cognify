'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Grip, Loader2, Pencil, PlusCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { Course, Module } from '@/util/types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';

interface ModulesFormProps {
  initialData: Course & {
    modules?: Module[];
  };
  courseId: number;
}

const formSchema = z.object({
  title: z.string().min(1),
});

function ModulesForm({ initialData, courseId }: ModulesFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting with courseId:', courseId);
      console.log('Submitting values:', values);

      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: values.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      toast.success('Module created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async (updateData: { moduleIds: number[] }) => {
    try {
      setIsUpdating(true);

      const response = await fetch(`/api/courses/${courseId}/modules/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder modules');
      }

      toast.success('Modules reordered');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };
  const onEdit = (moduleId: number) => {
    router.push(`/teacher/courses/${courseId}/modules/${moduleId}`);
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(initialData.modules || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (reorderedItem) {
      items.splice(result.destination.index, 0, reorderedItem);
    }

    const moduleIds = items.map((module) => module.id);
    onReorder({ moduleIds });
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course modules
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 m-2" />
              Add a module
            </>
          )}
        </Button>
      </div>

      {/* Existing Modules List with Drag and Drop */}
      {!isCreating && (
        <div className="mt-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {initialData.modules?.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                      No modules created yet
                    </p>
                  )}
                  {initialData.modules?.map((module, index) => (
                    <Draggable
                      key={module.id}
                      draggableId={module.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={cn(
                            'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                            module.is_published &&
                              'bg-sky-100 border-sky-200 text-sky-700',
                          )}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            className={cn(
                              'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                              module.is_published &&
                                'border-r-sky-200 hover:bg-sky-200',
                            )}
                            {...provided.dragHandleProps}
                          >
                            <Grip className="h-5 w-5" />
                          </div>
                          <div className="flex-1 px-2">{module.title}</div>
                          <div className="ml-auto pr-2 flex gap-x-2 items-center">
                            {module.is_free && <Badge>Free</Badge>}
                            <Badge
                              className={cn(
                                'mr-2 bg-slate-500',
                                module.is_published && 'bg-sky-700',
                              )}
                            >
                              {module.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            <Pencil
                              onClick={() => onEdit(module.id)}
                              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {!isCreating && (initialData.modules?.length ?? 0) > 1 && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder modules
        </p>
      )}
      {/* Create Module Form */}
      {isCreating && (
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
                  <FormLabel>Module title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter module title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ModulesForm;

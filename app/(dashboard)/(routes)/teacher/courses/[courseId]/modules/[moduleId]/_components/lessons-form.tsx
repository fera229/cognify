'use client';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Grip, Loader2, Pencil, PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Lesson, Module } from '@/util/types';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface LessonsFormProps {
  initialData: Module & { lessons: Lesson[] };
  moduleId: number;
  courseId: number;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
});

export default function LessonsForm({
  initialData,
  moduleId,
  courseId,
}: LessonsFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      isFree: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      toast.success('Lesson created');
      toggleCreating();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async (updateData: { lessonIds: number[] }) => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to reorder lessons');
      }

      toast.success('Lessons reordered');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (lessonId: number) => {
    router.push(
      `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(initialData.lessons || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (reorderedItem) {
      items.splice(result.destination.index, 0, reorderedItem);
    }

    const lessonIds = items.map((lesson) => lesson.id);
    onReorder({ lessonIds });
  };

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Module lessons
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a lesson
            </>
          )}
        </Button>
      </div>

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
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Lesson title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Lesson description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <div className="text-sm font-medium leading-none">
                      Mark as free preview
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Free preview lessons will be visible to all users
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className="mt-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {!initialData.lessons?.length && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                      No lessons created yet
                    </p>
                  )}
                  {initialData.lessons?.map((lesson, index) => (
                    <Draggable
                      key={lesson.id}
                      draggableId={lesson.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={cn(
                            'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                            lesson.is_published &&
                              'bg-sky-100 border-sky-200 text-sky-700',
                          )}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            className={cn(
                              'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                              lesson.is_published &&
                                'border-r-sky-200 hover:bg-sky-200',
                            )}
                            {...provided.dragHandleProps}
                          >
                            <Grip className="h-5 w-5 cursor-pointer" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{lesson.title}</div>
                            {/* <div className="text-xs">
                              {lesson.description || 'No description'}
                            </div> */}
                          </div>
                          <div className="pr-2 flex items-center gap-x-2">
                            {lesson.is_free && <Badge>Free</Badge>}
                            <Badge
                              className={cn(
                                'bg-slate-500',
                                lesson.is_published && 'bg-sky-700',
                              )}
                            >
                              {lesson.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            <Pencil
                              onClick={() => onEdit(lesson.id)}
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

      {!isCreating && (initialData.lessons?.length ?? 0) > 1 && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder lessons
        </p>
      )}
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Draggable } from '@hello-pangea/dnd';

interface LessonItemProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    is_published: boolean;
    is_free: boolean;
  };
  index: number;
  onEdit: (id: number) => void;
}

export default function LessonItem({ lesson, index, onEdit }: LessonItemProps) {
  return (
    <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
      {(provided) => (
        <div
          className={cn(
            'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
            lesson.is_published && 'bg-sky-100 border-sky-200 text-sky-700',
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className={cn(
              'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
              lesson.is_published && 'border-r-sky-200 hover:bg-sky-200',
            )}
            {...provided.dragHandleProps}
          >
            <Grip className="h-5 w-5 cursor-pointer" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{lesson.title}</div>
            <div className="text-xs">
              {lesson.description || 'No description'}
            </div>
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
  );
}

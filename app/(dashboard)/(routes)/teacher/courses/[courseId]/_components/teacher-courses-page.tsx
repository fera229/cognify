'use client';

import { useRouter } from 'next/navigation';
import { Pencil, GraduationCap, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/util/types';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';

interface TeacherCoursesPageProps {
  courses: Course[];
}

const TeacherCoursesPage = ({ courses = [] }: TeacherCoursesPageProps) => {
  const router = useRouter();

  const formatCreationDate = (date: Date) => {
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch {
      return 'Date unavailable';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Courses</h1>
          <p className="text-muted-foreground">
            Manage and track your course content
          </p>
        </div>
        {courses.length !== 0 && (
          <Link href="/teacher/create">
            <Button>Create New Course</Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center p-6 bg-slate-100 rounded-lg">
            <GraduationCap className="h-10 w-10 mx-auto text-slate-500 mb-2" />
            <h3 className="text-lg font-medium">No courses created</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first course.
            </p>
            <Link href="/teacher/create">
              <Button>Create your first course</Button>
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white border rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-40 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {course.title}
                    </h3>
                    <Badge
                      className={cn(
                        'mr-2 bg-slate-500 ml-auto rounded-2xl',
                        course.is_published && 'bg-sky-700',
                      )}
                    >
                      {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    {course.price !== null && course.price !== undefined && (
                      <Badge variant="outline">
                        ${Number(course.price).toFixed(2)}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {course.description || 'No description provided'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatCreationDate(course.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/teacher/courses/${course.id}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;

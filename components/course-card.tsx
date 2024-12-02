'use client';

import { BookOpen, Clock, Globe } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category, Course, CourseProgress } from '@/util/types';
import GetProgress from './get-progress';
import { formatDistance } from 'date-fns';
import { ClientOnly } from './providers/client-only';
import CoursePurchaseButton from './course-purchase-button';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  isEnrolled?: boolean;
  categories: Category[];
  hasAccess?: boolean;
}

const CourseCard = ({
  course,
  progress,
  isEnrolled,
  categories,
  hasAccess = false,
}: CourseCardProps) => {
  const {
    id,
    title,
    description,
    category_id,
    image_url,
    price,
    modules = [],
    created_at,
    is_published,
  } = course;

  const categoryName = category_id
    ? categories.find((cat) => cat.value === category_id.toString())?.label
    : 'Uncategorized';

  const publishedModules = modules.filter(
    (module) => module.is_published,
  ).length;

  const formatCreationDate = (date: Date) => {
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  return (
    <Card className="group overflow-hidden border rounded-lg hover:shadow-md transition-all">
      <div className="block">
        <div className="relative aspect-video w-full">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-slate-400" />
            </div>
          )}
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            {isEnrolled ? (
              <Badge variant="secondary">Enrolled</Badge>
            ) : price ? (
              <Badge variant="default">${price}</Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {categoryName || ''}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-x-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {publishedModules}
                {publishedModules === 1 ? ' module' : ' modules'}
              </span>
            </div>
            <div className="flex items-center gap-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatCreationDate(created_at)}</span>
            </div>
            {is_published && (
              <div className="flex items-center gap-x-1">
                <Globe className="h-4 w-4" />
                <span>Public</span>
              </div>
            )}
          </div>
          {isEnrolled && progress && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {progress.completedLessons} of {progress.totalLessons} lessons
                completed
              </span>
              <ClientOnly>
                <GetProgress
                  progressPercentage={progress.percentageComplete}
                  variant={
                    progress.percentageComplete === 100 ? 'success' : 'default'
                  }
                  size="sm"
                  type="circular"
                />
              </ClientOnly>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 mt-auto">
          {hasAccess || isEnrolled ? (
            // User has already purchased or is enrolled
            <div className="flex items-center w-full">
              <div className="w-full">
                <div className="h-10 mb-2"></div>{' '}
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => (window.location.href = `/courses/${id}`)}
                >
                  Continue Learning
                </Button>
              </div>
            </div>
          ) : (
            // User hasn't purchased
            <div className="w-full flex flex-col gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => (window.location.href = `/courses/${id}`)}
              >
                Preview Course
              </Button>
              {price !== null && price > 0 ? (
                <CoursePurchaseButton
                  courseId={id}
                  price={price}
                  hasAccess={hasAccess}
                />
              ) : (
                // Free course enrollment button
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = `/courses/${id}`)}
                >
                  Enroll Now (Free)
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default CourseCard;

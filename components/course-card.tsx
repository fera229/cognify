import { BookOpen, Clock, Globe } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/util/types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

const CourseCard = ({ course, isEnrolled }: CourseCardProps) => {
  const {
    id,
    title,
    description,
    image_url,
    price,
    modules = [],
    created_at,
    is_published,
  } = course;

  const totalModules = modules.length;
  const publishedModules = modules.filter(
    (module) => module.is_published,
  ).length;

  const formatCreationDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card className="group overflow-hidden border rounded-lg hover:shadow-md transition-all">
      <a href={isEnrolled ? `/courses/${id}` : '/login'} className="block">
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
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            {price ? (
              <Badge variant="default">${price}</Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description || 'No description provided'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-x-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {publishedModules} / {totalModules} modules
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
        </CardContent>
        <CardFooter className="p-4">
          <Button
            className="w-full"
            variant={isEnrolled ? 'secondary' : 'default'}
          >
            {isEnrolled ? 'Continue Learning' : 'Preview Course'}
          </Button>
        </CardFooter>
      </a>
    </Card>
  );
};

export default CourseCard;

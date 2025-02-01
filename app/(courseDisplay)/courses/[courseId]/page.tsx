import { File, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCourseById, getCourseAttachments } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { getLessonsByModuleId } from '@/database/lessons';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const paramsAwaited = await params;

  try {
    const [user, course, attachments] = await Promise.all([
      getUserFromSession(),
      getCourseById(paramsAwaited.courseId),
      getCourseAttachments(paramsAwaited.courseId),
    ]);

    if (!user || !course) {
      return redirect('/');
    }

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      (course.modules || []).map(async (module) => {
        const lessons = await getLessonsByModuleId(module.id.toString());
        return {
          ...module,
          lessons: lessons.filter(
            (lesson) => lesson.is_published || user.id === course.instructor_id,
          ),
        };
      }),
    );

    return (
      <div className="min-h-screen overflow-y-auto bg-blue-950">
        <div className="max-w-5xl mx-auto p-6 space-y-8 mb-32">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {course.image_url && (
              <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-slate-600 text-lg">{course.description}</p>
              )}
            </div>
          </div>

          {/* Course Attachments */}
          {attachments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Course Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 w-full bg-sky-50 border-sky-200 border text-sky-700 rounded-md hover:bg-sky-100 transition group"
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{attachment.name}</p>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Course Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Course Content
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {modulesWithLessons.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={`module-${module.id}`}
                  className="border rounded-lg mb-4 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 hover:bg-slate-50 [&[data-state=open]]:bg-slate-50">
                    <div className="flex items-center gap-x-2">
                      <span className="font-semibold">{module.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {module.lessons?.length || 0} lessons
                      </Badge>
                      {module.is_free && (
                        <Badge variant="secondary">Free</Badge>
                      )}
                      {!module.is_published && (
                        <Badge variant="secondary">Unpublished</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 space-y-2">
                      {module.lessons?.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}`}
                          className="flex items-center gap-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md p-3 transition"
                        >
                          <PlayCircle className="h-4 w-4 text-slate-500" />
                          <div className="flex-grow">
                            <span className="text-sm font-medium">
                              {lesson.title}
                            </span>
                            {lesson.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          {lesson.is_free && (
                            <Badge variant="secondary" className="ml-auto">
                              Free
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="h-32 bg-transparent" aria-hidden="true" />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading course:', error);
    return redirect('/');
  }
}

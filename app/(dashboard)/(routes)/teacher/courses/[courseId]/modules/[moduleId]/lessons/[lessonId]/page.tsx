import { getModuleById } from '@/database/modules';
import { getLessonById } from '@/database/lessons';
import { getUserFromSession } from '@/database/users';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, LayoutDashboard, Video } from 'lucide-react';
import { Banner } from '@/components/banner';
import Link from 'next/link';
import TitleForm from '../../../../_components/title';
import { LessonAccessForm } from './_components/lesson-access-form';
import { LessonVideoForm } from './_components/lesson-video-form';
import { LessonActions } from './_components/lesson-actions';

interface PageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

const LessonIdPage = async ({ params }: PageProps) => {
  const user = await getUserFromSession();
  const lesson = await getLessonById(params.lessonId);
  const module = await getModuleById(params.moduleId);

  if (!user) {
    return redirect('/login');
  }

  if (!lesson || !module) {
    return redirect('/');
  }

  const requiredFields = [
    lesson.title,
    lesson.video_url,
    lesson.description,
    lesson.is_published,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <>
      {!lesson.is_published && (
        <Banner
          variant="warning"
          label="This lesson is unpublished. It will not be visible in the course."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/modules/${params.moduleId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to module setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Lesson Setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <LessonActions
                disabled={!completedFields}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
                isPublished={lesson.is_published}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your lesson</h2>
              </div>

              <LessonAccessForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <LessonVideoForm
                initialData={lesson}
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonIdPage;

import { getModuleById } from '@/database/modules';
import { getUserFromSession } from '@/database/users';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { getCourseById } from '@/database/courses';
import ModuleActions from './_components/module-actions';
import { Banner } from '@/components/banner';
import toast from 'react-hot-toast';
import LessonsForm from './_components/lessons-form';
import TitleForm from '../../_components/title';
import DescriptionForm from '../../_components/description';
import { ClientOnly } from '@/components/providers/client-only';
import Link from 'next/link';

interface PageProps {
  params: {
    moduleId: string;
    courseId: string;
  };
}

const ModuleEditPage = async ({ params }: PageProps) => {
  const user = await getUserFromSession();
  const paramsAwaited = await params;
  const moduleId = paramsAwaited.moduleId;
  const courseId = paramsAwaited.courseId;

  const module = await getModuleById(moduleId);
  const course = await getCourseById(courseId);

  if (!user) {
    return redirect('/login');
  }

  if (!module || !course) {
    toast.error('Course/Module not found');
    return redirect('/');
  }

  // Verify the user is the course instructor
  if (course.instructor_id !== user.id) {
    return redirect('/');
  }

  const requiredFields = [
    module.title,
    module.description,
    module.lessons,
    module.is_published,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <ClientOnly>
      <>
        {!module.is_published && (
          <Banner
            variant="warning"
            label="This module is unpublished. It will not be visible in the course."
          />
        )}
        <div className="w-full  mt-6 ml-4">
          <Link
            href={`/teacher/courses/${paramsAwaited.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
        </div>
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Module Setup</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <ModuleActions
              disabled={!completedFields}
              moduleId={module.id}
              courseId={course.id}
              isPublished={module.is_published}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Customize your module</h2>
                </div>

                <div className="mt-4">
                  <TitleForm
                    initialData={{
                      ...course,
                      title: module.title || '',
                    }}
                    courseId={Number(course.id)}
                    entityId={Number(module.id)}
                    entityType="module"
                  />
                </div>
                <div>
                  <DescriptionForm
                    initialData={{
                      ...course,
                      description: module.description || '',
                    }}
                    courseId={Number(course.id)}
                    entityId={Number(module.id)}
                    entityType="module"
                  />
                </div>
                <LessonsForm
                  initialData={{
                    ...module,
                    lessons: module.lessons || [],
                  }}
                  courseId={Number(course.id)}
                  moduleId={Number(module.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </ClientOnly>
  );
};

export default ModuleEditPage;

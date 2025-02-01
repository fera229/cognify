import { Suspense } from 'react';
import { getModuleById } from '@/database/modules';
import { getUserFromSession } from '@/database/users';
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, LayoutDashboard, ScrollText } from 'lucide-react';
import { getCourseById } from '@/database/courses';
import { Banner } from '@/components/banner';
import { ClientOnly } from '@/components/providers/client-only';
import Link from 'next/link';
// import { ContentActions } from '@/components/content-actions';
import TitleForm from '../../_components/title';
import DescriptionForm from '../../_components/description';
import LessonsForm from './_components/lessons-form';
import { ModuleActions } from './_components/module-actions';

interface ModuleContentProps {
  moduleId: string;
  courseId: string;
}

interface PageProps {
  params: {
    courseId: string;
    moduleId: string;
  };
}

// Separate the content into its own component for better revalidation
async function ModuleContent({
  moduleId,
  courseId,
  paramsAwaited,
}: ModuleContentProps & {
  paramsAwaited: { courseId: string; moduleId: string };
}) {
  const module = await getModuleById(moduleId);
  const course = await getCourseById(courseId);

  if (!module || !course) {
    return null;
  }

  const requiredFields = [
    module.title,
    module.description,
    module.lessons?.some((lesson) => lesson.is_published),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = totalFields === completedFields;

  return (
    <>
      {!module.is_published && (
        <Banner
          variant="warning"
          label="This module is unpublished. It will not be visible in the course."
        />
      )}
      {/* {module.is_published && (
        <Banner
          variant="success"
          label="This module is published. It will be visible in the course."
        />
      )} */}
      <div className="w-full mt-6 ml-4">
        <Link
          href={`/teacher/courses/${courseId}`}
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
              {isComplete
                ? `All frields completed! you can publish the module now. ${completionText}`
                : `Complete all fields ${completionText}`}
            </span>
          </div>
          {/* <ContentActions
            data={{
              id: module.id.toString(),
              courseId: courseId,
              type: 'module',
              isPublished: module.is_published,
              requirementsMet:
                module.lessons?.some((l) => l.is_published) ?? false,
            }}
            disabled={false}
            isComplete={isComplete}
          /> */}
          <ModuleActions
            data={{
              courseId: paramsAwaited.courseId,
              moduleId: paramsAwaited.moduleId,
              is_published: module.is_published,
              lessons: module.lessons || [],
            }}
            disabled={false}
            isComplete={isComplete}
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
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ScrollText} />
              <h2 className="text-xl">Add lessons</h2>
            </div>
            <LessonsForm
              initialData={{
                ...module,
                lessons: module.lessons || [],
              }}
              courseId={Number(course.id)}
              moduleId={Number(module.id)}
            />{' '}
          </div>
        </div>
      </div>
    </>
  );
}

const ModuleEditPage = async ({
  params,
}: {
  params: { moduleId: string; courseId: string };
}) => {
  const user = await getUserFromSession();
  const paramsAwaited = await params;

  if (!paramsAwaited?.courseId || !paramsAwaited?.moduleId) {
    redirect('/login');
  }

  if (!user) {
    return redirect('/login');
  }

  const course = await getCourseById(paramsAwaited.courseId);
  if (!course || course.instructor_id !== user.id) {
    return redirect('/');
  }

  return (
    <ClientOnly>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <ModuleContent
          moduleId={paramsAwaited.moduleId}
          courseId={paramsAwaited.courseId}
          paramsAwaited={paramsAwaited}
        />
      </Suspense>
    </ClientOnly>
  );
};

export default ModuleEditPage;

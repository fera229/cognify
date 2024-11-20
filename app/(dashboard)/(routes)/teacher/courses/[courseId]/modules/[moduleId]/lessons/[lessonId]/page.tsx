import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getModuleById } from '@/database/modules';
import { getLessonById } from '@/database/lessons';
import { getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';
import { IconBadge } from '@/components/icon-badge';
import { Banner } from '@/components/banner';
import { ArrowLeft, LayoutDashboard, Video } from 'lucide-react';
import { LessonAccessForm } from './_components/lesson-access-form';
import { LessonVideoForm } from './_components/lesson-video-form';
import DescriptionForm from '../../../../_components/description';
import TitleForm from '../../../../_components/title';
import toast from 'react-hot-toast';
import { LessonsActions } from './_components/lesson-actions';
// import { ContentActions } from '@/components/content-actions';
// import { getActionData } from '@/util/actions-data';

interface PageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

const LessonIdPage = async ({ params }: PageProps) => {
  const paramsAwaited = await params;
  console.log('paramsAwaited', paramsAwaited);
  if (
    !paramsAwaited?.courseId ||
    !paramsAwaited?.moduleId ||
    !paramsAwaited?.lessonId
  ) {
    redirect('/');
  }
  try {
    const [user, lesson, module, course] = await Promise.all([
      getUserFromSession(),
      getLessonById(paramsAwaited.lessonId),
      getModuleById(paramsAwaited.moduleId),
      getCourseById(paramsAwaited.courseId),
    ]);
    if (!user || !lesson || !module || !course) {
      toast.error('An error occurred. Please try again.');
      return redirect('/');
    }

    // related to another approach where I was trying to build an actions component/api route (that allows the user to publish/unpublish and/or delete) that is mutual for all of courses, modules and lessons, left for later review.

    // const actionData = await getActionData({
    //   lessonId: paramsAwaited.lessonId,
    //   moduleId: paramsAwaited.moduleId,
    //   courseId: paramsAwaited.courseId,
    //   contentType: 'lesson',
    // });

    if (!user) {
      return redirect('/login');
    }

    if (!lesson || !module) {
      return redirect('/');
    }

    const requiredFields = [lesson.title, lesson.description, lesson.video_url];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

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
                href={`/teacher/courses/${paramsAwaited.courseId}/modules/${paramsAwaited.moduleId}`}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to module setup
              </Link>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Lesson Setup</h1>
                  <span className="text-sm text-slate-700">
                    {isComplete
                      ? `All frields completed! ${completionText}`
                      : `Complete all fields ${completionText}`}
                  </span>
                </div>
                {/* see comment above */}
                {/* <ContentActions disabled={false} actionData={actionData} /> */}
                {/* <ContentActions
                  data={{
                    id: lesson.id.toString(),
                    courseId: paramsAwaited.courseId,
                    type: 'lesson',
                    moduleId: paramsAwaited.moduleId,
                    is_published: lesson.is_published,
                    requirementsMet: true,
                  }}
                  disabled={false}
                  isComplete={isComplete}
                /> */}

                {/*new seperate actions/route handlers solution ⬇️ */}

                <LessonsActions
                  data={{
                    courseId: paramsAwaited.courseId,
                    lessonId: lesson.id.toString(),
                    moduleId: paramsAwaited.moduleId,
                    is_published: lesson.is_published,
                  }}
                  disabled={false}
                  isComplete={isComplete}
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
                <div className="mt-4">
                  <TitleForm
                    initialData={{
                      ...course,
                      title: lesson.title || '',
                    }}
                    courseId={Number(course.id)}
                    entityId={Number(lesson.id)}
                    entityType="lesson"
                  />
                </div>
                <div>
                  <DescriptionForm
                    initialData={{
                      ...course,
                      description: lesson.description || '',
                    }}
                    courseId={Number(course.id)}
                    entityId={Number(lesson.id)}
                    entityType="lesson"
                  />
                </div>
                <LessonAccessForm
                  initialData={lesson}
                  courseId={paramsAwaited.courseId}
                  moduleId={paramsAwaited.moduleId}
                  lessonId={paramsAwaited.lessonId}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Video} />
                  <h2 className="text-xl">Add a video</h2>
                </div>
              </div>
              <LessonVideoForm
                initialData={lesson}
                courseId={paramsAwaited.courseId}
                moduleId={paramsAwaited.moduleId}
                lessonId={paramsAwaited.lessonId}
              />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    redirect('/');
  }
};

export default LessonIdPage;

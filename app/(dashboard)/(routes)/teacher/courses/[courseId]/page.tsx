import { redirect } from 'next/navigation';
import {
  getCategories,
  getCourseAttachments,
  getCourseById,
} from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { IconBadge } from '@/components/icon-badge';
import {
  ArrowLeft,
  CircleDollarSign,
  Files,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import DescriptionForm from './_components/description';
import TitleForm from './_components/title';
import ImageForm from './_components/course-image';
import CategoryForm from './_components/category';
import PriceForm from './_components/price';
import AttachmentForm from './_components/attachments';
import ModulesForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/modules';
import { getCourseModules } from '@/database/modules';
import { CourseActions } from './_components/course-actions';
import Link from 'next/link';
// import { ContentActions } from '@/components/content-actions';
// import { getActionData } from '@/util/actions-data';

type PageProps = {
  params: { courseId: string };
};

export default async function CourseEditPage({ params }: PageProps) {
  const paramsAwaited = await params;

  if (!paramsAwaited?.courseId) {
    redirect('/');
  }
  try {
    const courseId = paramsAwaited.courseId;
    const user = await getUserFromSession();

    const [course, categories, attachments, modules] = await Promise.all([
      getCourseById(courseId),
      getCategories(),
      getCourseAttachments(courseId),
      getCourseModules(courseId),
    ]);
    // const actionData = await getActionData({
    //   courseId: paramsAwaited.courseId,
    //   contentType: 'lesson',
    // });

    if (!user) {
      return redirect('/login');
    }
    // redirect if the course doesn't exist or the user is not the creator of the course
    if (!course || user.id !== course?.instructor_id) {
      return redirect('/');
    }

    const requiredFields = [
      course.title,
      course.description,
      course.image_url,
      course.price,
      course.category_id,
      course.modules?.some((module) => module.is_published),
    ];

    const totalFields = requiredFields.length;

    const completedFields = requiredFields.filter(Boolean).length;

    const completionIndicator = ` (${completedFields}/${totalFields})`;

    const isComplete = totalFields === completedFields;

    return (
      <>
        <div className="w-full mt-6 ml-4 hover:cursor-pointer">
          <Link
            href="/teacher/courses"
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to teacher dashboard
          </Link>
        </div>
        <div className="max-w-5xl mx-auto p-6 pb-20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold mb-2">Edit Course</h1>
              <p className="text-muted-foreground mb-8">
                {isComplete
                  ? `All frields completed! ${completionIndicator}`
                  : `Complete all fields to publish the course for students ${completionIndicator}`}
              </p>
            </div>
            <CourseActions
              courseId={course.id.toString()}
              isPublished={course.is_published}
              disabled={false}
              isComplete={isComplete}
            />

            {/* <ContentActions disabled={false} actionData={actionData} /> */}
            {/* <ContentActions
          data={{
            id: course.id.toString(),
            courseId: course.id.toString(),
            type: 'course',
            isPublished: course.is_published,
            requirementsMet:
              course.modules?.some((m) => m.is_published) ?? false,
          }}
          disabled={false}
          isComplete={isComplete}
        /> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>
              <TitleForm
                initialData={course}
                courseId={course.id}
                entityId={course.id}
                entityType="course"
              />

              <DescriptionForm
                initialData={{
                  ...course,
                  description: course.description || '',
                }}
                courseId={course.id}
                entityId={course.id}
                entityType="course"
              />

              <ImageForm initialData={course} courseId={course.id} />
            </div>

            <div className="gap-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course modules</h2>
              </div>

              <ModulesForm
                initialData={{ ...course, modules: course.modules || [] }}
                courseId={course.id}
              />

              <div>
                <div className=" mt-4 flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
                </div>

                <PriceForm
                  initialData={{ price: course.price ?? 0 }}
                  courseId={course.id}
                />

                <div className=" mt-4 flex items-center gap-x-2">
                  <IconBadge icon={Files} />
                  <h2 className="text-xl">Resources</h2>
                </div>

                <AttachmentForm
                  initialData={{ course, attachments }}
                  courseId={course.id}
                />

                <CategoryForm
                  initialData={{
                    category_id: course.category_id?.toString() || null,
                  }}
                  courseId={course.id}
                  categories={categories}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    redirect('/login');
  }
}

import { redirect } from 'next/navigation';
import {
  getCategories,
  getCourseAttachments,
  getCourseById,
} from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { IconBadge } from '@/components/icon-badge';
import {
  CircleDollarSign,
  Files,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import DescriptionForm from './_components/description';
import TitleForm from './_components/title';
import ImageForm from './_components/courseImage';
import CategoryForm from './_components/category';
import PriceForm from './_components/price';
import AttachmentForm from './_components/attachments';
import { Attachment, Course, Module } from '@/util/types';
import ModulesForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/modules';
import { getCourseModules } from '@/database/modules';

type PageProps = {
  params: { courseId: string };
};

export default async function CourseEditPage({ params }: PageProps) {
  const paramsAwaited = await params;
  const courseId = paramsAwaited.courseId;
  const user = await getUserFromSession();

  const [course, categories, attachments, modules] = await Promise.all([
    getCourseById(courseId),
    getCategories(),
    getCourseAttachments(courseId),
    getCourseModules(courseId),
  ]);

  if (!user) {
    return redirect('/login');
  }
  // redirect if the course doesn't exist or the user is not the creator of the course
  if (!course || user.id !== course?.instructor_id) {
    return redirect('/');
  }
  const initialData: {
    course: Course;
    attachments: Attachment[];
    modules: Module[];
  } = {
    course: course,
    attachments: attachments,
    modules: modules,
  };
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

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      <h1 className="text-2xl font-bold mb-2">Edit Course</h1>
      <p className="text-muted-foreground mb-8">
        Complete your course information to publish it for students:
        {completionIndicator}
      </p>
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
            initialData={{ ...course, description: course.description || '' }}
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
  );
}

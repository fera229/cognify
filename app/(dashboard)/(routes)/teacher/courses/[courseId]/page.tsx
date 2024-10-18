import { redirect } from 'next/navigation';
import { getCourseById } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import DescriptionForm from './_components/description';
import TitleForm from './_components/title';
import ImageForm from './_components/courseImage';

type PageProps = {
  params: { courseId: string };
};

export default async function CourseEditPage({ params }: PageProps) {
  const { courseId } = await params;
  const user = await getUserFromSession();
  const course = await getCourseById(courseId);
  if (!user) {
    return redirect('/login');
  }
  // redirect if the user is not logged in, the course doesn't exist or the user is not the creator of the course
  if (!course || user.id !== course?.instructor_id) {
    return redirect('/');
  }
  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.category_id,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionIndicator = ` (${completedFields}/${totalFields})`;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Edit Course</h1>
      <p className="text-muted-foreground mb-8">
        Complete your course information to publish it for students:
        {completionIndicator}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />

          <DescriptionForm
            initialData={{ ...course, description: course.description || '' }}
            courseId={course.id}
          />

          <ImageForm />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';

const CourseIdPage = () => {
  const params = useParams();
  const courseId = params.courseId;
  return <div>Course Id: {courseId}</div>;
};

export default CourseIdPage;

// import { getCourseById } from '@/database/courses';
// import { getLessonById } from '@/database/lessons';
// import { getModuleById } from '@/database/modules';
// import { getUserFromSession } from '@/database/users';
// import { notFound, redirect } from 'next/navigation';

// interface GetActionDataProps {
//   lessonId?: string;
//   moduleId?: string;
//   courseId: string;
//   contentType: 'lesson' | 'module' | 'course';
// }

// interface BaseActionData {
//   isPublished: boolean;
//   courseId: string;
// }

// interface LessonActionData extends BaseActionData {
//   contentType: 'lesson';
//   lessonId: string;
//   moduleId: string;
// }

// interface ModuleActionData extends BaseActionData {
//   contentType: 'module';
//   moduleId: string;
// }

// interface CourseActionData extends BaseActionData {
//   contentType: 'course';
// }

// type ActionData = LessonActionData | ModuleActionData | CourseActionData;

// export async function getActionData({
//   lessonId,
//   moduleId,
//   courseId,
//   contentType,
// }: GetActionDataProps): Promise<ActionData> {
//   // Validate that courseId exists
//   if (!courseId) {
//     redirect('/');
//   }

//   try {
//     // First verify the course exists and user has access
//     const course = await getCourseById(courseId);
//     if (!course) {
//       redirect('/');
//     }

//     // Get user and verify permissions
//     const user = await getUserFromSession();
//     if (!user || user.id !== course.instructor_id) {
//       redirect('/');
//     }

//     switch (contentType) {
//       case 'lesson': {
//         if (!lessonId || !moduleId) {
//           redirect('/');
//         }

//         const [lesson, module] = await Promise.all([
//           getLessonById(lessonId),
//           getModuleById(moduleId),
//         ]);

//         if (!lesson || !module || module.course_id !== Number(courseId)) {
//           redirect('/');
//         }

//         return {
//           contentType: 'lesson',
//           isPublished: lesson.is_published,
//           lessonId: lesson.id.toString(),
//           moduleId: module.id.toString(),
//           courseId,
//         };
//       }

//       case 'module': {
//         if (!moduleId) {
//           redirect('/');
//         }

//         const module = await getModuleById(moduleId);

//         if (!module || module.course_id !== Number(courseId)) {
//           redirect('/');
//         }

//         return {
//           contentType: 'module',
//           isPublished: module.is_published,
//           moduleId: module.id.toString(),
//           courseId,
//         };
//       }

//       case 'course': {
//         return {
//           contentType: 'course',
//           isPublished: course.is_published,
//           courseId,
//         };
//       }

//       default:
//         redirect('/');
//     }
//   } catch (error) {
//     console.error('Error in getActionData:', error);
//     redirect('/');
//   }
// }

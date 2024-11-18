// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Trash } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ConfirmModal } from './modals/cofirm-modal';
// import toast from 'react-hot-toast';
// import { Route } from 'next';

// interface ActionData {
//   courseId: string;
//   id: string;
//   type: 'course' | 'module' | 'lesson';
//   is_published: boolean;
//   moduleId?: string;
//   requirementsMet: boolean;
// }

// interface ContentActionsProps {
//   data: ActionData;
//   disabled?: boolean;
//   isComplete?: boolean;
// }

// export function ContentActions({
//   data,
//   disabled,
//   isComplete,
// }: ContentActionsProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const getApiUrl = () => {
//     const baseUrl = `/api/courses/${data.courseId}`;

//     switch (data.type) {
//       case 'course':
//         // /api/courses/[courseId]/publish
//         return `${baseUrl}/publish`;
//       case 'module':
//         // /api/courses/[courseId]/modules/[moduleId]/publish
//         return `${baseUrl}/modules/${data.id}/publish`;
//       case 'lesson':
//         // /api/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/publish
//         return `${baseUrl}/modules/${data.moduleId}/lessons/${data.id}/publish`;
//     }
//   };

//   const getDeleteUrl = () => {
//     const baseUrl = `/api/courses/${data.courseId}`;

//     switch (data.type) {
//       case 'course':
//         return `${baseUrl}`;
//       case 'module':
//         return `${baseUrl}/modules/${data.id}`;
//       case 'lesson':
//         return `${baseUrl}/modules/${data.moduleId}/lessons/${data.id}`;
//     }
//   };

//   const getRedirectPath = (): Route => {
//     switch (data.type) {
//       case 'course':
//         return '/teacher/courses' as Route;
//       case 'module':
//         return `/teacher/courses/${data.courseId}` as Route;
//       case 'lesson':
//         return `/teacher/courses/${data.courseId}/modules/${data.moduleId}` as Route;
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(getDeleteUrl(), {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error();
//       }

//       toast.success(`${data.type} deleted successfully`);
//       router.push(getRedirectPath());
//       router.refresh();
//     } catch {
//       toast.error('Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onPublish = async () => {
//     try {
//       setIsLoading(true);
//       console.log('Starting publish action:', {
//         type: data.type,
//         id: data.id,
//         moduleId: data.moduleId,
//         currentis_published: data.is_published,
//         url: getApiUrl(),
//       });

//       const response = await fetch(getApiUrl(), {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           is_published: !data.is_published,
//         }),
//       });

//       const responseData = await response.json();
//       console.log('Server response with debug:', responseData);

//       if (responseData.debug) {
//         console.log('State change:', responseData.debug);
//       }

//       if (!response.ok) {
//         throw new Error(responseData.message || 'Failed to update');
//       }

//       toast.success(
//         data.is_published
//           ? `${data.type} unpublished`
//           : `${data.type} published`,
//       );

//       router.refresh();

//       // Add a small delay before refresh to ensure state is updated
//       await new Promise((resolve) => setTimeout(resolve, 100));
//       router.refresh();
//     } catch (error) {
//       console.error('Publish action failed:', error);
//       toast.error(
//         error instanceof Error ? error.message : 'Something went wrong',
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const confirmModalConfig = {
//     title: `Delete ${data.type}`,
//     description:
//       data.type === 'course'
//         ? 'This will permanently delete this course and all its content, including all modules and lessons.'
//         : data.type === 'module'
//           ? 'This will permanently delete this module and all its lessons.'
//           : 'This will permanently delete this lesson and its content.',
//   };
//   console.log('ContentActions rendered:', {
//     props: {
//       type: data.type,
//       id: data.id,
//       moduleId: data.moduleId,
//       is_published: data.is_published,
//       requirementsMet: data.requirementsMet,
//       disabled,
//       isComplete,
//     },
//     url: getApiUrl(),
//   });
//   return (
//     <div className="flex items-center gap-x-2">
//       <Button
//         onClick={onPublish}
//         disabled={
//           disabled ||
//           isLoading ||
//           (!data.requirementsMet && !data.is_published) ||
//           !isComplete
//         }
//         variant="outline"
//         size="sm"
//         className="bg-slate-200 hover:bg-slate-300"
//       >
//         {isLoading ? 'Loading...' : data.is_published ? 'Unpublish' : 'Publish'}
//       </Button>
//       <ConfirmModal onConfirm={onDelete} {...confirmModalConfig}>
//         <Button size="sm" disabled={isLoading} variant="destructive">
//           <Trash className="h-4 w-4" />
//         </Button>
//       </ConfirmModal>
//     </div>
//   );
// }

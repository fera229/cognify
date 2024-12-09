'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, GraduationCap, BookOpen, LayoutDashboard } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CourseCard from '@/components/course-card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { User } from '@/database/users';
import type { Course, Category, CourseProgress } from '@/util/types';

interface ProfilePageProps {
  user: User;
  enrolledCourses: Course[];
  categories: Category[];
  courseProgress: Map<number, CourseProgress>;
  coursesAccess: Map<number, boolean | undefined>;
}

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  email: z.string().email('Invalid email address'),
});

export default function ProfilePage({
  user,
  enrolledCourses,
  categories,
  courseProgress,
  coursesAccess,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSubmitting}
            >
              {isEditing ? (
                'Cancel'
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={undefined} />{' '}
              {/* Add user image field if needed */}
              <AvatarFallback>
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 flex-1"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <p className="font-medium">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {user.role === 'Instructor' && (
        <Alert>
          <LayoutDashboard className="h-4 w-4" />
          <AlertTitle>You are an instructor</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Create and manage your courses in the teacher dashboard.
            </span>
            <Button
              variant="default"
              onClick={() => router.push('/teacher/courses')}
              className="ml-4"
            >
              Go to Teacher Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">My Enrolled Courses</h2>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-10 bg-slate-100 rounded-lg">
            <BookOpen className="h-10 w-10 mx-auto text-slate-500 mb-2" />
            <h3 className="text-lg font-medium">No courses yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Button onClick={() => router.push('/search')}>
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                categories={categories}
                progress={courseProgress.get(course.id)}
                isEnrolled={true}
                hasAccess={coursesAccess.get(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

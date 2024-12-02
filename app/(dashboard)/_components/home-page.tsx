import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, Layout, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/course-card';
import type { Course } from '@/util/types';
import { getCategories } from '@/database/courses';
import { getUserFromSession } from '@/database/users';

// Get courses sorted by publication date with offset
function getCoursesByPublishDate(
  courses: Course[],
  offset: number = 0,
  limit: number = 3,
) {
  return [...courses]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(offset, offset + limit);
}

export default async function HomePage({ courses }: { courses: Course[] }) {
  const user = await getUserFromSession();
  const categories = await getCategories();

  // Get published courses only
  const publishedCourses = courses.filter((course) => course.is_published);

  // Get course sections
  const newestCourses = getCoursesByPublishDate(publishedCourses, 0, 3);
  const secondNewestCourses = getCoursesByPublishDate(publishedCourses, 3, 3);
  const thirdNewestCourses = getCoursesByPublishDate(publishedCourses, 6, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Show hero section only for non-logged in users */}
      {!user && (
        <>
          {/* Hero Section */}
          <div className="relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-blue-500/50 z-10" />

            {/* Content */}
            <div className="relative z-20 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Transform Your Future with Online Learning
                </h1>
                <p className="mt-6 text-xl text-white/90">
                  Access world-class courses from expert instructors. Learn at
                  your own pace and unlock your potential with Cognify's
                  comprehensive learning platform.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link href="/search">
                    <Button
                      size="lg"
                      className="bg-white text-blue-900 hover:bg-gray-100"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Explore Courses
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-semibold leading-6 text-white hover:text-white/90 transition-colors"
                  >
                    Create an account <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">10K+ Students</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">500+ Courses</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Layout className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">50+ Categories</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">4.8/5 Rating</h3>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Latest Courses */}
      {newestCourses.length > 0 && (
        <div className={`${!user ? 'bg-gray-50' : 'bg-white'} py-16`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Latest Releases
                </h2>
                <p className="mt-2 text-gray-600">
                  Our most recently published courses
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newestCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  categories={categories}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Courses */}
      {secondNewestCourses.length > 0 && (
        <div className={`${!user ? 'bg-white' : 'bg-gray-50'} py-16`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Trending Now
                </h2>
                <p className="mt-2 text-gray-600">
                  Popular courses gaining traction
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondNewestCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  categories={categories}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Courses */}
      {thirdNewestCourses.length > 0 && (
        <div className={`${!user ? 'bg-gray-50' : 'bg-white'} py-16`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Featured Collection
                </h2>
                <p className="mt-2 text-gray-600">
                  Curated selection of established courses
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thirdNewestCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  categories={categories}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

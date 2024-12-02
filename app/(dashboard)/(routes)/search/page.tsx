import { getPublicCourses, getCategories } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import ExplorePage from '@/components/explore-page';
import { hasAccessToCourse } from '@/database/enrollments';

export default async function SearchPage() {
  try {
    const [courses, categories, user] = await Promise.all([
      getPublicCourses(),
      getCategories(),
      getUserFromSession(),
    ]);

    // Get access status for all courses if user is logged in
    let courseAccessMap = new Map<number, boolean | undefined>();
    if (user) {
      const accessPromises = courses.map((course) =>
        hasAccessToCourse(user.id, course.id),
      );
      const accessResults = await Promise.all(accessPromises);
      courseAccessMap = new Map(
        courses.map((course, index) => [course.id, accessResults[index]]),
      );
    }

    return (
      <ExplorePage
        courses={courses}
        categories={categories}
        currentUser={user}
        coursesAccess={courseAccessMap}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }
}

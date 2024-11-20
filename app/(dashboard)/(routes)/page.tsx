import { Suspense } from 'react';
import { getCategories, getCourses } from '@/database/courses';
import { Loader2 } from 'lucide-react';
import ExplorePage from '@/components/explore-page';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/database/users';
import { sql } from '@/database/connect';

interface CourseFromDB {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  is_published: boolean;
  category_id: number | null;
  instructor_id: number;
  created_at: string;
  updated_at: string;
  modules: Array<{
    id: number;
    title: string;
    is_published: boolean;
    position: number;
  }> | null;
}

async function getAllPublicCourses() {
  try {
    const courses = await sql<CourseFromDB[]>`
      SELECT
        c.*,
        json_agg(
          json_build_object(
            'id',
            m.id,
            'title',
            m.title,
            'is_published',
            m.is_published,
            'position',
            m.position
          )
        ) AS modules
      FROM
        courses c
        LEFT JOIN modules m ON c.id = m.course_id
      WHERE
        c.is_published = TRUE
      GROUP BY
        c.id
      ORDER BY
        c.created_at DESC
    `;

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image_url: course.image_url,
      price: course.price,
      is_published: course.is_published,
      category_id: course.category_id,
      instructor_id: course.instructor_id,
      created_at: new Date(course.created_at),
      updated_at: new Date(course.updated_at),
      modules: course.modules?.[0] ? course.modules : [],
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

async function ExplorePageContent() {
  const user = await getUserFromSession();
  const [coursesData, categoriesData] = await Promise.all([
    getAllPublicCourses(),
    getCategories(),
  ]);

  return (
    <ExplorePage
      courses={coursesData}
      categories={categoriesData}
      currentUser={
        user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : null
      }
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}

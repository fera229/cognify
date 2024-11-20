import { Suspense } from 'react';
import { getCategories, getPublicCourses } from '@/database/courses';
import { Loader2 } from 'lucide-react';
import ExplorePage from '@/components/explore-page';
import { getUserFromSession } from '@/database/users';

async function ExplorePageContent() {
  const user = await getUserFromSession();
  const [coursesData, categoriesData] = await Promise.all([
    getPublicCourses(),
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

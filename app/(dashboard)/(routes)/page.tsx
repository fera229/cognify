import { Suspense } from 'react';
import { getPublicCourses } from '@/database/courses';
import { Loader2 } from 'lucide-react';
import HomePage from '../_components/home-page';

async function HomePageContent() {
  const courses = await getPublicCourses();
  return <HomePage courses={courses} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

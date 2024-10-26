// app/(dashboard)/(routes)/page.tsx
import { Suspense } from 'react';
import { getCategories, getCourses } from '@/database/courses';

// Separate component for data fetching
async function HomeContent() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ]);

  return <div>Home</div>;
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

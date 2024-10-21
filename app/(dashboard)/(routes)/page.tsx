import { getCategories, getCourses } from '@/database/courses';

export default async function Home() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ]);

  return <div>Home</div>;
}

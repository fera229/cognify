//app/(dashboard)/(routes)/teacher/courses/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function CoursesPage() {
  return (
    <div className="p-4">
      <Link href={'/teacher/create'}>
        <Button>New Course</Button>
      </Link>
    </div>
  );
}

export default CoursesPage;

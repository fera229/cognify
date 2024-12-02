'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CourseCard from '@/components/course-card';
import type { Course, Category, CourseProgress } from '@/util/types';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
}

interface ExplorePageProps {
  courses: Course[];
  categories: Category[];
  currentUser: User | null;
  coursesProgress?: Map<number, CourseProgress>;
  coursesAccess: Map<number, boolean | undefined>;
}

// TODO: // Create a better implementation with Debounced Server-Side Search

const ExplorePage = ({
  courses: initialCourses,
  categories,
  currentUser,
  coursesAccess,
}: ExplorePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Client-side filtering - No DB query but might be memory-intensive (especially if we have a lot of courses to render).
  const filteredCourses = initialCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' ||
        course.category_id?.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((CourseA, CourseB) => {
      if (sortBy === 'recent') {
        return (
          new Date(CourseB.created_at).getTime() -
          new Date(CourseA.created_at).getTime()
        );
      }
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">
            {currentUser
              ? `Welcome, ${currentUser.name}! Find your next learning adventure.`
              : 'Discover and enroll in courses to start learning'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {categories.length > 0 && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as 'recent' | 'popular')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'No courses found matching your criteria'
              : 'No courses available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              categories={categories}
              isEnrolled={coursesAccess.get(course.id) || false}
              hasAccess={coursesAccess.get(course.id) || false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;

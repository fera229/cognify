'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

function CreateNewCourse() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = title.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError('Title is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response:', data);
      router.push(`/teacher/courses/${data.course.id}` as any);
      toast.success('Course created!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong, please try again later.');
      setError('Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Create a new Course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your Course? Don't worry! you can change
          this later!
        </p>
        <form onSubmit={onSubmit} className="space-y-8 mt-8">
          <div>
            <label className="block text-sm font-medium">Course title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder='i.e. "Introduction to Computer Science"'
              className="mt-1"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex items-center gap-x-2">
            <Link href="/teacher/courses">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewCourse;

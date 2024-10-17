export type SearchParams = {
  returnTo: string | string[];
};

export type Category = {
  id: number;
  name: string;
};

export type Course = {
  id: number;
  title: string;
  description: string | null;
  instructor_id: number | null;
  price: number | null;
  is_published: boolean;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
};

export type EditCourseFormProps = {
  courseId: string;
  initialData: Course;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
};

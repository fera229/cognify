export type SearchParams = {
  returnTo: string | string[];
};
export type Category = {
  label: string;
  value: string;
};

export type Course = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  instructor_id: number | null;
  price: number | null;
  is_published: boolean;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
  modules?: Module[];
};
export type Module = {
  id: number;
  title: string;
  description: string | null;
  position: number;
  course_id: number;
  is_published: boolean;
  is_free: boolean;
  created_at: Date;
  updated_at: Date;
  // Relation
  lessons?: Lesson[];
};

export type Lesson = {
  id: number;
  title: string;
  description: string | null;
  position: number;
  module_id: number;
  is_published: boolean;
  is_free: boolean;
  video_url: string | null;
  duration: number | null;
  created_at: Date;
  updated_at: Date;
  // Relations
  muxData?: MuxData;
  userProgress?: UserProgress[];
};

export type MuxData = {
  id: number;
  lesson_id: number;
  asset_id: string;
  playback_id: string;
  created_at: Date;
  updated_at: Date;
};

export type UserProgress = {
  id: number;
  user_id: number;
  lesson_id: number;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Attachment = {
  id: number;
  name: string;
  url: string;
  course_id: number;
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

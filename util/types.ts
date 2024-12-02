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

export type CourseFromDB = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  instructor_id: number;
  price: number | null;
  is_published: boolean;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  modules: Array<{
    id: number;
    title: string;
    description: string | null;
    position: number;
    course_id: number;
    is_published: boolean;
    is_free: boolean;
    created_at: string;
    updated_at: string;
  }> | null;
};

export type VideoUploadResponse = {
  asset_id: string;
  playback_id: string;
  duration: number;
  status: 'preparing' | 'ready' | 'errored';
};

export type MuxData = {
  id: number;
  lesson_id: number;
  asset_id: string;
  playback_id: string;
  created_at: Date;
  updated_at: Date;
  duration?: number; // Add duration for AI context
  status?: string; // Track processing status
};

export type TranscriptSegment = {
  text: string;
  start_time: number;
  end_time: number;
  speaker?: string; // Optional field for later (detect instructor?)
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

export type CourseDetailsRow = {
  // Course fields
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  instructor_id: number;
  is_published: boolean;
  category_id: number | null;
  created_at: string;
  updated_at: string;

  // Module fields
  module_id: number | null;
  module_title: string | null;
  module_description: string | null;
  module_position: number | null;
  module_is_published: boolean | null;
  module_created_at: string | null;
  module_updated_at: string | null;

  // Lesson fields
  lesson_id: number | null;
  lesson_title: string | null;
  lesson_description: string | null;
  lesson_position: number | null;
  lesson_is_published: boolean | null;
  lesson_video_url: string | null;
  lesson_duration: number | null;
  lesson_created_at: string | null;
  lesson_updated_at: string | null;

  // User progress fields
  user_progress_id: number | null;
  user_progress_is_completed: boolean | null;
};

export type CourseDetails = Omit<
  CourseDetailsRow,
  | 'created_at'
  | 'updated_at'
  | 'module_created_at'
  | 'module_updated_at'
  | 'lesson_created_at'
  | 'lesson_updated_at'
> & {
  created_at: Date;
  updated_at: Date;
  module_created_at: Date | null;
  module_updated_at: Date | null;
  lesson_created_at: Date | null;
  lesson_updated_at: Date | null;
};

export type CourseProgress = {
  totalLessons: number;
  completedLessons: number;
  percentageComplete: number;
};

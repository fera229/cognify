export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { hasAccessToCourse } from '@/database/enrollments';
import { getUserFromSession } from '@/database/users';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 },
      );
    }

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ hasAccess: false });
    }

    const hasAccess = await hasAccessToCourse(user.id, parseInt(courseId));
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('[ENROLLMENT_CHECK]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

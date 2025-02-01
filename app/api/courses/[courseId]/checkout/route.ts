export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getCourseById } from '@/database/courses';
import { getUserFromSession } from '@/database/users';
import { createEnrollment, hasAccessToCourse } from '@/database/enrollments';
import toast from 'react-hot-toast';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    // Get the user from the session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const paramsAwaited = await params;
    // Get the course
    const course = await getCourseById(paramsAwaited.courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.price) {
      return NextResponse.json(
        { error: 'Course is not for sale' },
        { status: 400 },
      );
    }
    const hasAccess = await hasAccessToCourse(
      user.id,
      Number(paramsAwaited.courseId),
    );
    if (hasAccess) {
      toast.error('You already have access to this course');
      return NextResponse.json(
        { error: 'You already have access to this course' },
        { status: 400 },
      );
    }

    // Create a pending enrollment
    const enrollment = await createEnrollment(user.id, Number(params.courseId));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description || undefined,
              images: course.image_url ? [course.image_url] : undefined,
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=true`,
      metadata: {
        courseId: course.id.toString(),
        userId: user.id.toString(),
        enrollmentId: enrollment.id.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[COURSE_CHECKOUT]', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

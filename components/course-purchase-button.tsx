import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Check, Loader2 } from 'lucide-react';
import { getUserFromSession } from '@/database/users';
import { getCourseById } from '@/database/courses';

export default function CoursePurchaseButton({
  courseId,
  price,
  hasAccess = false,
}: {
  courseId: number;
  price: number | null;
  hasAccess?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      //   const [user, course] = await Promise.all([
      //     getUserFromSession(),
      //     getCourseById(String(courseId)),
      //   ]);

      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start checkout');
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error('Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAccess) {
    return (
      <Button disabled className="w-full">
        <Check className="h-4 w-4 mr-2" />
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>Purchase for ${price}</>
      )}
    </Button>
  );
}

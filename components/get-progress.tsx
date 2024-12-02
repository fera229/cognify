'use client';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GetProgressProps {
  progressPercentage: number;
  variant?: 'default' | 'success';
  size?: 'sm' | 'default';
  type?: 'circular' | 'linear';
}

const GetProgress = ({
  progressPercentage,
  variant = 'default',
  size = 'default',
  type = 'linear', // 'circular' | 'linear'
}: GetProgressProps) => {
  const isCompleted = progressPercentage === 100;

  const getColor = () => {
    if (isCompleted) return '#10b981'; // Emerald-500
    return variant === 'success' ? '#10b981' : '#2563eb'; // Blue-600
  };

  if (type === 'circular') {
    return (
      <div
        className={cn(
          'relative transition-transform hover:scale-105',
          size === 'sm' ? 'w-12 h-12' : 'w-16 h-16',
        )}
      >
        <CircularProgressbar
          value={progressPercentage}
          text={isCompleted ? '' : `${Math.round(progressPercentage)}%`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: 'round',
            textSize: '20px',
            pathTransitionDuration: 0.5,
            pathColor: getColor(),
            textColor: getColor(),
            trailColor: variant === 'success' ? '#d1fae5' : '#dbeafe',
            backgroundColor: '#3e98c7',
          })}
        />
        {isCompleted && (
          <CheckCircle2
            className={cn(
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              'text-emerald-500 animate-scale-check',
              size === 'sm' ? 'w-6 h-6' : 'w-8 h-8',
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      <div
        className={cn(
          'flex-grow h-2 rounded-full overflow-hidden bg-slate-100',
          variant === 'success' ? 'bg-emerald-100' : 'bg-blue-100',
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variant === 'success' ? 'bg-emerald-500' : 'bg-blue-600',
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="min-w-[3rem] flex items-center">
        {isCompleted ? (
          <CheckCircle2
            className={cn(
              'h-5 w-5 animate-scale-check',
              variant === 'success' ? 'text-emerald-500' : 'text-blue-600',
            )}
          />
        ) : (
          <span
            className={cn(
              'text-sm font-medium',
              variant === 'success' ? 'text-emerald-700' : 'text-blue-700',
            )}
          >
            {Math.round(progressPercentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default GetProgress;

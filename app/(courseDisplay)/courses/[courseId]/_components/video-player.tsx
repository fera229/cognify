import { useState, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
}

export default function VideoPlayer({ videoUrl, lessonId }: VideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setError(null);
    setIsLoading(true);
  }, [videoUrl]);

  const handleError = (e: any) => {
    setIsLoading(false);
    if (e?.message?.includes('does not exist')) {
      setError(
        'This video is currently unavailable. It may have been removed or is still processing.',
      );
    } else if (e?.type === 'networkError') {
      setError(
        'Network error occurred. Please check your connection and try again.',
      );
    } else {
      setError('An error occurred while trying to play this video.');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Video Playback Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
      <MuxPlayer
        playbackId={videoUrl}
        metadata={{ video_id: lessonId }}
        onError={handleError}
        onPlaying={() => setIsLoading(false)}
        streamType="on-demand"
        autoPlay={false}
        className={`w-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      />
    </div>
  );
}

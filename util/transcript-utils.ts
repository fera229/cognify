import type { TranscriptSegment } from '@/util/types';

export function parseVTT(
  vttContent: string | null | undefined,
): TranscriptSegment[] {
  if (!vttContent) {
    console.warn('No VTT content provided to parse');
    return [];
  }

  const segments: TranscriptSegment[] = [];
  const lines = vttContent.split('\n');
  let currentSegment: Partial<TranscriptSegment> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || '';

    if (!line) continue;

    if (line.includes('-->')) {
      const timestampParts = line.split('-->');
      if (timestampParts.length !== 2) continue;

      const startTime = parseVTTTimestamp(timestampParts[0]?.trim());
      const endTime = parseVTTTimestamp(timestampParts[1]?.trim());

      if (startTime !== null && endTime !== null) {
        currentSegment.start_time = startTime;
        currentSegment.end_time = endTime;
      }
    } else if (!line.includes('WEBVTT') && !line.match(/^\d+$/)) {
      currentSegment.text = ((currentSegment.text || '') + ' ' + line).trim();

      if (
        typeof currentSegment.start_time === 'number' &&
        typeof currentSegment.end_time === 'number' &&
        currentSegment.text
      ) {
        segments.push({
          start_time: currentSegment.start_time,
          end_time: currentSegment.end_time,
          text: currentSegment.text,
        });
        currentSegment = {};
      }
    }
  }

  return segments;
}

export function parseVTTTimestamp(
  timestamp: string | null | undefined,
): number | null {
  if (!timestamp) return null;

  try {
    const [time, msString] = timestamp.split('.') ?? [];
    if (!time) return null;

    const [hoursStr, minutesStr, secondsStr] = time.split(':') ?? [];

    const hours = parseInt(hoursStr || '0', 10);
    const minutes = parseInt(minutesStr || '0', 10);
    const seconds = parseInt(secondsStr || '0', 10);
    const ms = parseInt(msString || '0', 10);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      isNaN(seconds) ||
      isNaN(ms) ||
      minutes >= 60 ||
      seconds >= 60
    ) {
      return null;
    }

    return hours * 3600 + minutes * 60 + seconds + ms / 1000;
  } catch (error) {
    console.error('Error parsing VTT timestamp:', error);
    return null;
  }
}

export function formatTimeToVTT(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return '00:00:00.000';
  }

  try {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}.${padZero(ms, 3)}`;
  } catch (error) {
    console.error('Error formatting time to VTT:', error);
    return '00:00:00.000';
  }
}

function padZero(num: number | null | undefined, width: number = 2): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0'.repeat(width);
  }
  return num.toString().padStart(width, '0');
}

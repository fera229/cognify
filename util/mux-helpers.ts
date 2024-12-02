import type { MuxAssetData, MuxError, MuxSubtitle } from '@/util/mux.types';
import type { TranscriptSegment } from '@/util/types';

export async function waitForAssetReady(
  assetId: string,
  authHeader: string,
  maxAttempts = 10,
): Promise<MuxAssetData> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(
      `https://api.mux.com/video/v1/assets/${assetId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to check asset status: ${response.statusText}`);
    }

    const data = (await response.json()) as MuxAssetData | MuxError;
    if ('error' in data) {
      throw new Error(`Mux API error: ${data.error.message}`);
    }

    if (data.data.status === 'ready') {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    attempts++;
  }

  throw new Error('Asset processing timeout');
}

export async function getSubtitles(
  assetId: string,
  authHeader: string,
  maxAttempts = 20,
): Promise<TranscriptSegment[]> {
  let attempts = 0;
  const pollInterval = 5000;

  while (attempts < maxAttempts) {
    try {
      const assetData = await waitForAssetReady(assetId, authHeader);

      const subtitle = assetData.data.subtitles?.find(
        (sub: MuxSubtitle) =>
          sub.name === 'English (auto)' && sub.status === 'ready' && sub.url,
      );

      if (subtitle?.url) {
        const vttResponse = await fetch(subtitle.url);
        if (!vttResponse.ok) {
          throw new Error(`Failed to fetch VTT: ${vttResponse.statusText}`);
        }

        const vttContent = await vttResponse.text();
        const segments = parseVTT(vttContent);

        if (segments.length > 0) {
          return segments;
        }
      }
    } catch (error) {
      console.error(`Subtitle fetch attempt ${attempts + 1} failed:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    attempts++;
  }

  return [];
}

export function parseVTT(vttContent: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const lines = vttContent.split('\n');
  let currentSegment: Partial<TranscriptSegment> = {};

  const parseTime = (timeStr: string): number => {
    try {
      const [mainTime, milliseconds = '000'] = timeStr.split('.') || [
        '00:00:00',
        '000',
      ];

      if (!mainTime) {
        throw new Error('Invalid time format');
      }

      const timeParts = mainTime.split(':');
      const [seconds = '0', minutes = '0', hours = '0'] = timeParts.reverse();

      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);
      const secondsNum = parseInt(seconds, 10);
      const millisecondsNum = parseInt(milliseconds, 10);

      if (
        isNaN(hoursNum) ||
        isNaN(minutesNum) ||
        isNaN(secondsNum) ||
        isNaN(millisecondsNum)
      ) {
        throw new Error('Invalid time values');
      }

      return (
        hoursNum * 3600 + minutesNum * 60 + secondsNum + millisecondsNum / 1000
      );
    } catch (error) {
      console.error('Error parsing time:', error);
      return 0;
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    if (trimmedLine.includes('-->')) {
      const parts = trimmedLine.split('-->');
      if (parts.length !== 2) continue;

      const [startStr, endStr] = parts.map((p) => p.trim());
      if (!startStr || !endStr) continue;

      const start = parseTime(startStr);
      const end = parseTime(endStr);

      currentSegment = {
        ...currentSegment,
        start_time: start,
        end_time: end,
      };
    } else if (
      trimmedLine &&
      !trimmedLine.includes('WEBVTT') &&
      !/^\d+$/.test(trimmedLine)
    ) {
      currentSegment.text = trimmedLine;

      if (
        typeof currentSegment.start_time === 'number' &&
        typeof currentSegment.end_time === 'number' &&
        typeof currentSegment.text === 'string' &&
        currentSegment.start_time >= 0 &&
        currentSegment.end_time > currentSegment.start_time
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

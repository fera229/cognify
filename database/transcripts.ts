import 'server-only';
import { sql } from './connect';
import type { TranscriptSegment } from '@/util/types';

export async function getTranscriptSegmentsById(
  lessonId: string,
): Promise<TranscriptSegment[]> {
  try {
    const [result] = await sql<
      {
        transcript_segments: TranscriptSegment[];
      }[]
    >`
      SELECT
        transcript_segments
      FROM
        video_transcripts
      WHERE
        lesson_id = ${lessonId}
      ORDER BY
        created_at DESC
      LIMIT
        1
    `;

    if (result && result.transcript_segments) {
      return result.transcript_segments;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching transcript segments:', error);
    return [];
  }
}

async function fetchTranscriptSegments(
  lessonId: string,
): Promise<TranscriptSegment[]> {
  try {
    const transcriptSegments = await getTranscriptSegmentsById(lessonId);
    return transcriptSegments;
  } catch (error) {
    console.error('Error fetching transcript segments:', error);
    return [];
  }
}

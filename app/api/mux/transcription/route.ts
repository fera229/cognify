import { NextResponse } from 'next/server';
import { checkIfSessionIsValid } from '@/database/users';
import { sql } from '@/database/connect';
import type { MuxData } from '@/util/types';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { videoUrl, lessonId } = body;

    // Create asset with auto-generated subtitles
    const asset = await mux.video.assets.create({
      input: [
        {
          url: videoUrl,
          generated_subtitles: [
            {
              language_code: 'en',
              name: 'English (generated)',
              passthrough: 'auto-generated',
            },
          ],
        },
      ],
      playback_policy: ['public'],
      mp4_support: 'standard',
    });

    // Store in mux_data table
    const [muxData] = await sql<MuxData[]>`
      INSERT INTO
        mux_data (
          lesson_id,
          asset_id,
          playback_id
        )
      VALUES
        (
          ${lessonId},
          ${asset.id},
          ${asset.playback_ids?.[0]?.id || ''}
        )
      RETURNING
        *
    `;

    // Update lesson with video URL
    await sql`
      UPDATE lessons
      SET
        video_url = ${asset.playback_ids?.[0]?.id || ''},
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ${lessonId}
    `;

    return NextResponse.json(muxData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Mux API Error:', error.message);
    } else {
      console.error('Unexpected error:', String(error));
    }

    return NextResponse.json(
      { message: 'Error processing video' },
      { status: 500 },
    );
  }
}

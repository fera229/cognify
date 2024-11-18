import { NextResponse } from 'next/server';
import { checkIfSessionIsValid } from '@/database/users';
import { sql } from '@/database/connect';
import { MuxData } from '@/util/types';
import Mux from '@mux/mux-node';

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  throw new Error('Missing Mux credentials');
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log('1. Starting Mux video processing...');

    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      console.log('Session invalid');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.log('2. Session validated');

    const body = await req.json();
    const { videoUrl, lessonId } = body;

    console.log('3. Received request:', { videoUrl, lessonId });

    if (!videoUrl || !lessonId) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'videoUrl and lessonId are required' },
        { status: 400 },
      );
    }

    // Create asset with auto-generated subtitles
    console.log('4. Creating Mux asset...');
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
      mp4_support: 'capped-1080p',
    });
    console.log('5. Mux asset created:', asset);

    // Store in mux_data table
    console.log('6. Storing in mux_data table...');
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
    console.log('7. Stored in mux_data:', muxData);

    // Update lesson with video URL
    console.log('8. Updating lesson...');
    await sql`
      UPDATE lessons
      SET
        video_url = ${asset.playback_ids?.[0]?.id || ''},
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ${lessonId}
    `;
    console.log('9. Lesson updated');

    return NextResponse.json(muxData);
  } catch (error: unknown) {
    // Detailed error logging
    console.error('Mux API Error:', {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : String(error),
      credentials: {
        hasMuxToken: !!process.env.MUX_TOKEN_ID,
        hasMuxSecret: !!process.env.MUX_TOKEN_SECRET,
      },
    });

    // Error response with more details
    return NextResponse.json(
      {
        message: 'Error processing video',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'UnknownError',
      },
      { status: 500 },
    );
  }
}

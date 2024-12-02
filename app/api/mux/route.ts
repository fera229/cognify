import { NextResponse } from 'next/server';
import { checkIfSessionIsValid } from '@/database/users';
import { sql } from '@/database/connect';
import type { MuxData } from '@/util/types';
import Mux from '@mux/mux-node';

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  throw new Error('Missing Mux credentials');
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(req: Request) {
  try {
    console.log('1. Starting Mux video processing...');

    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      console.log('Session invalid');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { videoUrl, lessonId } = await req.json();
    console.log('2. Processing request for:', { videoUrl, lessonId });

    if (!videoUrl || !lessonId) {
      return NextResponse.json(
        { message: 'videoUrl and lessonId are required' },
        { status: 400 },
      );
    }

    try {
      // Create Mux asset
      console.log('3. Creating Mux asset...');
      const asset = await mux.video.assets.create({
        input: [
          {
            url: videoUrl,
          },
        ],
        playback_policy: ['public'],
        test: false,
      });

      console.log('4. Asset created:', asset);

      if (!asset?.id || !asset?.playback_ids?.[0]?.id) {
        throw new Error('Failed to get asset information from Mux');
      }

      // Save to mux_data table
      console.log('5. Saving to database...');
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
            ${asset.playback_ids[0].id}
          )
        RETURNING
          *
      `;

      // Update lesson
      await sql`
        UPDATE lessons
        SET
          video_url = ${asset.playback_ids[0].id},
          duration = ${asset.duration || 0},
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ${lessonId}
      `;

      console.log('6. Successfully processed video');

      // Match the response structure expected by the frontend
      return NextResponse.json({
        muxData,
        asset: {
          id: asset.id,
          playbackId: asset.playback_ids[0].id,
          duration: asset.duration || 0,
        },
      });
    } catch (error) {
      console.error('Mux API error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to process video with Mux',
      );
    }
  } catch (error) {
    console.error('Error in Mux route:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    );
  }
}

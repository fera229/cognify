import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE video_transcripts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      lesson_id integer NOT NULL REFERENCES lessons (id) ON DELETE cascade,
      transcript_segments jsonb NOT NULL, -- Stores array of segments with timestamps
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE INDEX idx_video_transcripts_lesson_id ON video_transcripts (lesson_id);
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE IF EXISTS video_transcripts`;
}

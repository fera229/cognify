import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE mux_data (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      lesson_id integer NOT NULL REFERENCES lessons (id) ON DELETE cascade,
      asset_id text NOT NULL,
      playback_id text NOT NULL,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`CREATE INDEX idx_mux_data_lesson_id ON mux_data (lesson_id);`;
  await sql`CREATE INDEX idx_mux_data_asset_id ON mux_data (asset_id);`;
  await sql`CREATE INDEX idx_mux_data_playback_id ON mux_data (playback_id);`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE IF EXISTS mux_data cascade;`;
}

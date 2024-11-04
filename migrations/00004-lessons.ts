import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE lessons (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(255) NOT NULL,
      description text,
      POSITION integer NOT NULL,
      module_id integer NOT NULL REFERENCES modules (id) ON DELETE cascade,
      is_published boolean DEFAULT FALSE,
      is_free boolean DEFAULT FALSE,
      video_url text,
      duration integer,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`CREATE INDEX idx_lessons_module_id ON lessons (module_id);`;
  await sql`CREATE INDEX idx_lessons_position ON lessons (POSITION);`;
  await sql`CREATE INDEX idx_lessons_is_published ON lessons (is_published);`;
  await sql`CREATE INDEX idx_lessons_is_free ON lessons (is_free);`;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS lessons cascade; `;
}

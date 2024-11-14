import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE lessons (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
        start
        WITH
          1 increment by 1 minvalue 1
      ),
      title varchar(255) NOT NULL,
      description text,
      POSITION integer NOT NULL,
      module_id integer NOT NULL REFERENCES modules (id) ON DELETE cascade,
      is_published boolean DEFAULT FALSE,
      is_free boolean DEFAULT FALSE,
      video_url text,
      duration integer,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT positive_lesson_id CHECK (id > 0),
      CONSTRAINT positive_lesson_position CHECK (POSITION >= 0),
      CONSTRAINT positive_duration CHECK (
        duration IS NULL
        OR duration >= 0
      )
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

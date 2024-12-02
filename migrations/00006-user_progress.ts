import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE user_progress (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      lesson_id integer NOT NULL REFERENCES lessons (id) ON DELETE cascade,
      is_completed boolean DEFAULT FALSE,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, lesson_id)
    );
  `;
  await sql`CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);`;

  await sql`
    CREATE INDEX idx_user_progress_lesson_id ON user_progress (lesson_id);
  `;

  await sql`
    CREATE INDEX idx_user_progress_is_completed ON user_progress (is_completed);
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS user_progress; `;
}

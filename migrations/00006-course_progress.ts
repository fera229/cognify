import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE course_progress (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer,
      lesson_id integer,
      completed boolean DEFAULT FALSE,
      completed_at timestamptz,
      FOREIGN key (user_id) REFERENCES users (id),
      FOREIGN key (lesson_id) REFERENCES lessons (id),
      UNIQUE (user_id, lesson_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS course_progress; `;
}

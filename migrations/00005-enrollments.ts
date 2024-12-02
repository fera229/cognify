import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE enrollments (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      course_id integer NOT NULL REFERENCES courses (id) ON DELETE cascade,
      is_paid boolean NOT NULL DEFAULT FALSE,
      enrollment_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, course_id)
    );
  `;

  await sql`
    CREATE INDEX idx_enrollments_user_course ON enrollments (user_id, course_id);
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS enrollments cascade; `;
}

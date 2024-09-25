import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE COURSE_PROGRESS (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id INTEGER,
      lesson_id INTEGER,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      FOREIGN KEY (user_id) REFERENCES USERS(id),
      FOREIGN KEY (lesson_id) REFERENCES LESSONS(id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE IF EXISTS COURSE_PROGRESS;
  `;
}

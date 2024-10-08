import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE ENROLLMENTS (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id INTEGER,
      course_id INTEGER,
      enrollment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50),
      FOREIGN KEY (user_id) REFERENCES USERS(id),
      FOREIGN KEY (course_id) REFERENCES COURSES(id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE IF EXISTS ENROLLMENTS;
  `;
}

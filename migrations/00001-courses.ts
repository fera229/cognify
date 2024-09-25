import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE COURSES (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      instructor_id INTEGER,
      start_date TIMESTAMPTZ,
      end_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructor_id) REFERENCES USERS(id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE IF EXISTS COURSES;
  `;
}

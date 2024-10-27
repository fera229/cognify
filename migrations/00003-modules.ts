import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE MODULES (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      course_id INTEGER,
      title VARCHAR(255) NOT NULL,
      "order" INTEGER,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES COURSES(id) ON DELETE CASCADE
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE IF EXISTS MODULES;
  `;
}

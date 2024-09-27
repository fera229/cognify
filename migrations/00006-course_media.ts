import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
  CREATE TABLE COURSE_MEDIA (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id INTEGER REFERENCES COURSES(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- For example: 'thumbnail', 'video'
    media_url VARCHAR(255) NOT NULL, -- URL or file path for the media
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE COURSE_MEDIA;
  `;
}

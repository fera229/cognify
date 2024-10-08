import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE course_media (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      course_id integer REFERENCES courses (id) ON DELETE cascade,
      media_type varchar(50) NOT NULL, -- For example: 'thumbnail', 'video'
      media_url varchar(255) NOT NULL, -- URL or file path for the media
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE course_media; `;
}

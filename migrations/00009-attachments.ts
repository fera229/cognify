import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE attachments (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(255) NOT NULL,
      url text NOT NULL,
      course_id integer NOT NULL,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      FOREIGN key (course_id) REFERENCES courses (id) ON DELETE cascade
    );
  `;
  await sql` CREATE INDEX idx_course_id ON attachments (course_id); `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS attachments; `;
}

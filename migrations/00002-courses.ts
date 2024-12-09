import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE courses (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
        start
        WITH
          1 increment by 1 minvalue 1
      ),
      title varchar(255) NOT NULL,
      image_url text,
      description text,
      instructor_id integer,
      price numeric(10, 2),
      is_published boolean DEFAULT FALSE,
      category_id integer,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      FOREIGN key (instructor_id) REFERENCES users (id),
      FOREIGN key (category_id) REFERENCES categories (id),
      CONSTRAINT positive_course_id CHECK (id > 0)
    );
  `;
  await sql` CREATE INDEX idx_category_id ON courses (category_id); `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS courses; `;
}

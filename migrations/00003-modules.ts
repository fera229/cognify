import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE modules (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
        start
        WITH
          1 increment by 1 minvalue 1
      ),
      title varchar(255) NOT NULL,
      description text,
      POSITION integer NOT NULL,
      course_id integer NOT NULL REFERENCES courses (id) ON DELETE cascade,
      is_published boolean DEFAULT FALSE,
      is_free boolean DEFAULT FALSE,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP CONSTRAINT positive_module_id CHECK (id > 0),
      CONSTRAINT positive_module_position CHECK (POSITION >= 0)
    );
  `;
  await sql`CREATE INDEX idx_modules_course_id ON modules (course_id);`;
  await sql`CREATE INDEX idx_modules_position ON modules (POSITION);`;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS modules cascade; `;
}

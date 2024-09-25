import { Sql } from "postgres";

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE LESSONS (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      module_id INTEGER,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      content_type VARCHAR(50),
      "order" INTEGER,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES MODULES(id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE IF EXISTS LESSONS;
  `;
}

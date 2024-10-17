// migrations/00001-categories.ts
import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE categories (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(255) UNIQUE NOT NULL
    );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE IF EXISTS categories; `;
}

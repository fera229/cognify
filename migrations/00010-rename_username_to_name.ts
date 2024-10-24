import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE users
    RENAME COLUMN name TO name;
  `;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE users
    RENAME COLUMN name TO name;
  `;
}

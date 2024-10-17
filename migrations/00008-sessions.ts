import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE sessions (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      token varchar(150) NOT NULL UNIQUE,
      -- ❌ expiry_timestamp is generating only 22 hours!
      expiry_timestamp timestamp NOT NULL DEFAULT now() + interval '1 day',
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE sessions`;
}

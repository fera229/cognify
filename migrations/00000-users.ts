import {Sql} from "postgres";

export async function up(sql: Sql) {
  await sql`
CREATE TABLE USERS (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

  `;

}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE USERS;
  `;

}

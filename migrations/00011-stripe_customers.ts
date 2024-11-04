import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE stripe_customers (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      stripe_customer_id text NOT NULL,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id),
      UNIQUE (stripe_customer_id)
    )
  `;

  await sql`
    CREATE INDEX idx_stripe_customers_stripe_customer_id ON stripe_customers (stripe_customer_id)
  `;

  await sql`
    CREATE INDEX idx_stripe_customers_user_id ON stripe_customers (user_id);
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE IF EXISTS stripe_customers cascade`;
}

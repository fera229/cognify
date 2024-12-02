// import 'server-only';
import postgres from 'postgres';
import type { Sql } from 'postgres';

declare global {
  var postgresSqlClient: Sql | undefined;
}

// Connection configuration
const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  idle_timeout: 20,
  max: 10,
  connection: {
    application_name: 'cognify_lms',
  },
  onnotice: () => {}, // Suppress notice messages
  onparameter: () => {}, // Handle parameters
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  types: {
    bigint: postgres.BigInt,
  },
};

// Connect only once to the database
function connectOneTimeToDatabase(): Sql {
  if (!global.postgresSqlClient) {
    try {
      global.postgresSqlClient = postgres(config);

      // Add cleanup for development
      if (process.env.NODE_ENV !== 'production') {
        process.on('beforeExit', () => {
          if (global.postgresSqlClient) {
            global.postgresSqlClient.end().catch(console.error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to create database connection:', error);
      throw error;
    }
  }
  return global.postgresSqlClient;
}

export const sql = connectOneTimeToDatabase();

// Add a health check function
export async function checkDatabaseConnection() {
  try {
    const result = await sql`
      SELECT
        1
    `;
    return result != null;
  } catch (error) {
    console.error('Database health check failed:', error);
    // Reset connection on failure
    global.postgresSqlClient = undefined;
    return false;
  }
}

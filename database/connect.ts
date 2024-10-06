import 'server-only';
import postgres, { Sql } from 'postgres';
import { User } from './users';

declare module globalThis {
  let postgresSqlClient: Sql;
}

// Connect only once to the database
function connectOneTimeToDatabase(): Sql {
  if (!('postgresSqlClient' in globalThis)) {
    globalThis.postgresSqlClient = postgres();
  }
  return globalThis.postgresSqlClient;
}

export const sql = connectOneTimeToDatabase();

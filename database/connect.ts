import 'server-only'
import postgres, {Sql} from 'postgres';

declare module globalThis {
    let postgresSqlClient: Sql;
  }
  
  // Connect only once to the database
  function connectOneTimeToDatabase() {
    if (!('postgresSqlClient' in globalThis)) {
      globalThis.postgresSqlClient = postgres();
    }}

export const sql = connectOneTimeToDatabase();
import postgres from "postgres";
import { config } from "dotenv-safe";


config();

const sql = postgres({HOST: process.env.PGHOST,
    port: process.env.PGPORT,
    DATABASE: process.env.PGDATABASE,
    USER: process.env.PGUSERNAME,
    PASSWORD: process.env.PGPASSWORD
});


console.log(await sql`
    SELECT
        *
    FROM
        users
`);

await sql.end();


export default sql;
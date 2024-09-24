import postgres from "postgres";
import { config } from "dotenv-safe";

console.log(config());

config();

const sql = postgres({ host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD});


async function fetchUsers() {
    try {
        const users = await sql`
            SELECT
                *
            FROM
                users
        `;
        console.log(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Call the async function
fetchUsers();

export default sql;
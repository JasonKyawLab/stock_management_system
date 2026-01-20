import { Pool } from "pg";
import { env } from "../config/env.js";

// Connection pool for PostgreSQL
const pool = new Pool({
    host: env.postgres.host,
    port: env.postgres.port,
    database: env.postgres.database,
    user: env.postgres.user,
    password: env.postgres.password
});


// Test Connection
pool.on("connect",() => {
    console.log("✅ PostgreSQL Connected ");
});

pool.on("error", (err) => {
    console.error("❌ PostgreSQL error : ", err);
    process.exit(1);
});

export default pool;
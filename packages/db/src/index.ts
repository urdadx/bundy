import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import * as schema from "./schema";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = process.env.SQLITE_PATH || process.env.DATABASE_URL;

const defaultPath = join(__dirname, "..", "sqlite.db");
const dbPath = envPath || defaultPath;

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

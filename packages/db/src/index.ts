import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import * as schema from "./schema";


const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve DB path from environment for container friendliness.
// Priority: `SQLITE_PATH` -> `DATABASE_URL` (file:...) -> package-local sqlite.db
const envPath = process.env.SQLITE_PATH || (() => {
	const url = process.env.DATABASE_URL;
	if (url && url.startsWith("file:")) return url.replace(/^file:/, "");
	return undefined;
})();

const defaultPath = join(__dirname, "..", "sqlite.db");
const dbPath = envPath || defaultPath;

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

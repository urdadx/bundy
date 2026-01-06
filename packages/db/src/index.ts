import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import * as schema from "./schema";


const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", "sqlite.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

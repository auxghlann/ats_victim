import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DATABASE_FILE || path.resolve(process.cwd(), "dev.db");

// Maintain singleton in development across Next.js HMR reloads
const globalForDb = globalThis as unknown as {
  sqliteDb: Database.Database | undefined;
};

export function getDatabase(): Database.Database {
  if (!globalForDb.sqliteDb) {
    const db = new Database(DB_PATH);
    
    // Performance and integrity pragmas
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    
    // Auto-migrate schema on initialization
    const schemaPath = path.resolve(process.cwd(), "src/lib/db/schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf-8");
      db.exec(schemaSql);
    }

    // Incremental column migrations
    try {
      const appCols = (db.prepare("PRAGMA table_info(applications)").all() as { name: string }[]).map((c) => c.name);
      if (appCols.length > 0 && !appCols.includes("work_setup")) {
        db.exec("ALTER TABLE applications ADD COLUMN work_setup TEXT CHECK (work_setup IN ('remote', 'hybrid', 'on-site'))");
      }
    } catch {
      // Table may not exist yet
    }
    
    globalForDb.sqliteDb = db;
  }
  
  return globalForDb.sqliteDb;
}

export const db = getDatabase();
export default db;

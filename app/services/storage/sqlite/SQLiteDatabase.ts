import Database from 'better-sqlite3';

export interface SQLiteConfig {
  filename: string;
  readonly?: boolean;
  fileMustExist?: boolean;
}

export class SQLiteDatabase {
  private db: Database.Database;

  constructor(config: SQLiteConfig) {
    const options: any = {};
    if (config.readonly !== undefined) {
      options.readonly = config.readonly;
    }
    if (config.fileMustExist !== undefined) {
      options.fileMustExist = config.fileMustExist;
    }
    
    this.db = new Database(config.filename, options);

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  get database(): Database.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }

  // Utility methods for common operations
  prepare(sql: string) {
    return this.db.prepare(sql);
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  // Simple migration runner using GPT-5's inline approach
  runMigrations(): void {
    const migration = `
BEGIN;
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  startAt INTEGER NOT NULL,
  startLat REAL NOT NULL,
  startLon REAL NOT NULL,
  endAt INTEGER,
  endLat REAL,
  endLon REAL,
  distanceMeters REAL NOT NULL DEFAULT 0,
  title TEXT,
  notes TEXT,
  appliedRoutineId TEXT,
  lastFixAt INTEGER,
  totalFixes INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS trip_fixes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tripId TEXT NOT NULL,
  ts INTEGER NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  accuracy REAL NOT NULL,
  speedMps REAL,
  source TEXT,
  FOREIGN KEY(tripId) REFERENCES trips(id)
);
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT
);
CREATE INDEX IF NOT EXISTS idx_trip_fixes_trip_ts ON trip_fixes(tripId, ts);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
COMMIT;`;
    this.db.exec(migration);
  }
}

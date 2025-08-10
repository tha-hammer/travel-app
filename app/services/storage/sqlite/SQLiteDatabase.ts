import SQLite, { SQLiteDatabase as RNSQLiteDB, Location } from 'react-native-sqlite-storage';

export interface SQLiteConfig {
  name: string;
  location?: Location;
}

// Enable debugging in development
SQLite.DEBUG(false);
SQLite.enablePromise(true);

export class SQLiteDatabase {
  private db!: RNSQLiteDB;
  private isOpen = false;

  constructor(private config: SQLiteConfig) {}

  async open(): Promise<void> {
    if (this.isOpen) return;
    
    this.db = await SQLite.openDatabase({
      name: this.config.name,
      location: this.config.location || 'default' as Location,
    });
    
    this.isOpen = true;

    // Enable foreign keys
    await this.db.executeSql('PRAGMA foreign_keys = ON');
  }

  async close(): Promise<void> {
    if (!this.isOpen) return;
    await this.db.close();
    this.isOpen = false;
  }

  private ensureOpen(): void {
    if (!this.isOpen) {
      throw new Error('Database is not open. Call open() first.');
    }
  }

  // Async execute for single statements
  async executeSql(sql: string, params: any[] = []): Promise<any[]> {
    this.ensureOpen();
    const [result] = await this.db.executeSql(sql, params);
    return result.rows.raw();
  }

  // Transaction support
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    this.ensureOpen();
    return new Promise((resolve, reject) => {
      this.db.transaction(async (tx: any) => {
        try {
          const result = await fn(tx);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, reject);
    });
  }

  // Simple migration runner using async approach for React Native
  async runMigrations(): Promise<void> {
    this.ensureOpen();
    
    const migrations = [
      `CREATE TABLE IF NOT EXISTS trips (
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
      )`,
      `CREATE TABLE IF NOT EXISTS trip_fixes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tripId TEXT NOT NULL,
        ts INTEGER NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        accuracy REAL NOT NULL,
        speedMps REAL,
        source TEXT,
        FOREIGN KEY(tripId) REFERENCES trips(id)
      )`,
      `CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        notes TEXT,
        category TEXT
      )`,
      `CREATE INDEX IF NOT EXISTS idx_trip_fixes_trip_ts ON trip_fixes(tripId, ts)`,
      `CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status)`
    ];

    for (const migration of migrations) {
      await this.db.executeSql(migration);
    }
  }
}

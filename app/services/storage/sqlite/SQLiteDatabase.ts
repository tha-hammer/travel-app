import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

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

  async runMigrations(migrationsDir: string): Promise<void> {
    // Create migrations table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        applied_at INTEGER NOT NULL
      );
    `);

    // Get list of applied migrations
    const appliedMigrations = this.db
      .prepare('SELECT filename FROM migrations ORDER BY filename')
      .all()
      .map((row: any) => row.filename);

    // Read available migration files (assuming they follow naming convention: 0001_init.sql)
    const migrationFiles = ['0001_init.sql']; // In real implementation, read from filesystem

    // Apply pending migrations
    for (const filename of migrationFiles) {
      if (!appliedMigrations.includes(filename)) {
        console.log(`Applying migration: ${filename}`);
        
        try {
          const migrationSQL = readFileSync(join(migrationsDir, filename), 'utf8');
          this.db.exec(migrationSQL);
          
          // Record the migration as applied
          this.db
            .prepare('INSERT INTO migrations (filename, applied_at) VALUES (?, ?)')
            .run(filename, Date.now());
            
          console.log(`Migration applied successfully: ${filename}`);
        } catch (error) {
          console.error(`Failed to apply migration ${filename}:`, error);
          throw error;
        }
      }
    }
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
}
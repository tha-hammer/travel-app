import Database from 'better-sqlite3';
import { runMigrations } from './SQLiteMigrations';
import { SQLiteDatabase } from '../SQLiteDatabase';

export function openDatabase(filename = 'travel-app.db'): SQLiteDatabase {
  const db = new Database(filename);
  // @ts-ignore provide minimal wrapper conforming to our interface
  const wrapped: SQLiteDatabase = db as any;
  runMigrations(wrapped as any);
  return wrapped;
}

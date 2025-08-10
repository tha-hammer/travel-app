import { SQLiteDatabase } from '../SQLiteDatabase';

export function openDatabase(filename = 'travel-app.db'): SQLiteDatabase {
  const db = new SQLiteDatabase({ filename });
  db.runMigrations();
  return db;
}

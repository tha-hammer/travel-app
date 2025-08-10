import { SQLiteDatabase } from '../SQLiteDatabase';

export async function openDatabase(name = 'travel-app.db'): Promise<SQLiteDatabase> {
  const db = new SQLiteDatabase({ name });
  await db.open();
  await db.runMigrations();
  return db;
}

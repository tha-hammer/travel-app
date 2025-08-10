export interface SQLitePreparedStatement {
  run(...params: any[]): any;
  get<T = any>(...params: any[]): T | undefined;
  all<T = any>(...params: any[]): T[];
}

export interface SQLiteDatabase {
  prepare(sql: string): SQLitePreparedStatement;
  exec(sql: string): void;
}

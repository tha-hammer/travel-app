"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDatabase = openDatabase;
const SQLiteDatabase_1 = require("../SQLiteDatabase");
function openDatabase(filename = 'travel-app.db') {
    const db = new SQLiteDatabase_1.SQLiteDatabase({ filename });
    db.runMigrations();
    return db;
}

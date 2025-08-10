"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteTemplateRepository = void 0;
class SQLiteTemplateRepository {
    constructor(db) {
        this.db = db;
    }
    async upsert(template) {
        const stmt = this.db.prepare(`INSERT INTO templates (id, title, notes, category)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title, notes=excluded.notes, category=excluded.category`);
        stmt.run(template.id, template.title, template.notes ?? null, template.category ?? null);
        return { ...template };
    }
    async list() {
        const stmt = this.db.prepare(`SELECT * FROM templates ORDER BY title ASC`);
        const rows = stmt.all();
        return rows.map(r => ({ id: r.id, title: r.title, notes: r.notes ?? undefined, category: r.category ?? undefined }));
    }
    async findById(id) {
        const stmt = this.db.prepare(`SELECT * FROM templates WHERE id=?`);
        const row = stmt.get(id);
        return row ? { id: row.id, title: row.title, notes: row.notes ?? undefined, category: row.category ?? undefined } : null;
    }
}
exports.SQLiteTemplateRepository = SQLiteTemplateRepository;

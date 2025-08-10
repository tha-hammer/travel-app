import { RoutineTripTemplate } from '@models/entities/RoutineTripTemplate';
import { TemplateRepository } from '@models/repositories/TemplateRepository';
import { SQLiteDatabase } from '../SQLiteDatabase';

export class SQLiteTemplateRepository implements TemplateRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async upsert(template: RoutineTripTemplate): Promise<RoutineTripTemplate> {
    await this.db.executeSql(`INSERT INTO templates (id, title, notes, category)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title, notes=excluded.notes, category=excluded.category`, 
      [template.id, template.title, template.notes ?? null, template.category ?? null]);
    return { ...template };
  }

  async list(): Promise<RoutineTripTemplate[]> {
    const rows = await this.db.executeSql(`SELECT * FROM templates ORDER BY title ASC`);
    return rows.map(r => ({ id: r.id, title: r.title, notes: r.notes ?? undefined, category: r.category ?? undefined }));
  }

  async findById(id: string): Promise<RoutineTripTemplate | null> {
    const rows = await this.db.executeSql(`SELECT * FROM templates WHERE id=?`, [id]);
    return rows.length > 0 ? 
      { id: rows[0].id, title: rows[0].title, notes: rows[0].notes ?? undefined, category: rows[0].category ?? undefined } : 
      null;
  }
}

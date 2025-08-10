import { RoutineTripTemplate } from '@models/entities/RoutineTripTemplate';
import { TemplateRepository } from '@models/repositories/TemplateRepository';
import { SQLiteDatabase } from '../SQLiteDatabase';

export class SQLiteTemplateRepository implements TemplateRepository {
  constructor(private db: SQLiteDatabase) {}

  async upsert(template: RoutineTripTemplate): Promise<RoutineTripTemplate> {
    const stmt = this.db.prepare(`
      INSERT INTO templates (id, title, notes, category)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        notes = excluded.notes,
        category = excluded.category
    `);

    stmt.run(template.id, template.title, template.notes || null, template.category || null);
    
    return { ...template };
  }

  async list(): Promise<RoutineTripTemplate[]> {
    const stmt = this.db.prepare(`
      SELECT id, title, notes, category
      FROM templates
      ORDER BY title
    `);

    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      notes: row.notes || undefined,
      category: row.category || undefined
    }));
  }

  async findById(id: string): Promise<RoutineTripTemplate | null> {
    const stmt = this.db.prepare(`
      SELECT id, title, notes, category
      FROM templates
      WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      notes: row.notes || undefined,
      category: row.category || undefined
    };
  }
}
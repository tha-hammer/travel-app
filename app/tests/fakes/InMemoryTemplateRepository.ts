import { RoutineTripTemplate } from '@models/entities/RoutineTripTemplate';
import { TemplateRepository } from '@models/repositories/TemplateRepository';

export class InMemoryTemplateRepository implements TemplateRepository {
  private store = new Map<string, RoutineTripTemplate>();

  async upsert(template: RoutineTripTemplate): Promise<RoutineTripTemplate> {
    this.store.set(template.id, { ...template });
    return { ...template };
  }

  async list(): Promise<RoutineTripTemplate[]> {
    const templates = Array.from(this.store.values())
      .sort((a, b) => a.title.localeCompare(b.title));
    return templates.map(t => ({ ...t }));
  }

  async findById(id: string): Promise<RoutineTripTemplate | null> {
    const template = this.store.get(id);
    return template ? { ...template } : null;
  }
}
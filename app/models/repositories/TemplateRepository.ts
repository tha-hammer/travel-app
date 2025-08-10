import { RoutineTripTemplate } from '../entities/RoutineTripTemplate';

export interface TemplateRepository {
  upsert(template: RoutineTripTemplate): Promise<RoutineTripTemplate>;
  list(): Promise<RoutineTripTemplate[]>;
  findById(id: string): Promise<RoutineTripTemplate | null>;
}

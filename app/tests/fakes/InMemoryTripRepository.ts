import { Trip } from '../../models/entities/Trip';
import { TripRepository } from '../../models/repositories/TripRepository';

export class InMemoryTripRepository implements TripRepository {
  private store = new Map<string, Trip>();

  async create(trip: Trip): Promise<Trip> {
    this.store.set(trip.id, { ...trip });
    return { ...trip };
  }

  async update(trip: Trip): Promise<Trip> {
    this.store.set(trip.id, { ...trip });
    return { ...trip };
  }

  async findById(id: string): Promise<Trip | null> {
    const t = this.store.get(id);
    return t ? { ...t } : null;
  }

  async getActive(): Promise<Trip | null> {
    for (const t of this.store.values()) {
      if (t.status === 'active') return { ...t };
    }
    return null;
  }

  async list(params?: { limit?: number; offset?: number; from?: number; to?: number }): Promise<Trip[]> {
    let items = Array.from(this.store.values()).sort((a, b) => b.startAt - a.startAt);
    if (params?.from) items = items.filter(t => t.startAt >= params.from!);
    if (params?.to) items = items.filter(t => t.startAt <= params.to!);
    if (params?.offset) items = items.slice(params.offset);
    if (params?.limit) items = items.slice(0, params.limit);
    return items.map(t => ({ ...t }));
  }
}

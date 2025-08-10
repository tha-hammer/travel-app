import { Trip } from '../entities/Trip';

export interface TripRepository {
  create(trip: Trip): Promise<Trip>;
  update(trip: Trip): Promise<Trip>;
  findById(id: string): Promise<Trip | null>;
  list(params?: { limit?: number; offset?: number; from?: number; to?: number }): Promise<Trip[]>;
  getActive(): Promise<Trip | null>;
}

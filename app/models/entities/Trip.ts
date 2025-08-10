export interface Trip {
  id: string;
  status: 'active' | 'completed' | 'abandoned';
  startAt: number; // ms epoch
  startLat: number;
  startLon: number;
  endAt?: number; // ms epoch
  endLat?: number;
  endLon?: number;
  distanceMeters: number;
  title?: string;
  notes?: string;
  appliedRoutineId?: string;
  lastFixAt?: number;
  totalFixes?: number;
}

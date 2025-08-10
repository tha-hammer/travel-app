"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripRepositoryContractTests = tripRepositoryContractTests;
function tripRepositoryContractTests(createRepository, cleanup) {
    describe('TripRepository Contract Tests', () => {
        let repo;
        beforeEach(() => {
            repo = createRepository();
        });
        afterEach(async () => {
            if (cleanup)
                await cleanup();
        });
        describe('create', () => {
            it('should create and return a trip', async () => {
                const trip = createTestTrip();
                const result = await repo.create(trip);
                expect(result).toEqual(trip);
            });
            it('should persist the trip for later retrieval', async () => {
                const trip = createTestTrip();
                await repo.create(trip);
                const retrieved = await repo.findById(trip.id);
                expect(retrieved).toEqual(trip);
            });
        });
        describe('update', () => {
            it('should update an existing trip', async () => {
                const trip = createTestTrip();
                await repo.create(trip);
                const updated = { ...trip, distanceMeters: 1000, title: 'Updated Trip' };
                const result = await repo.update(updated);
                expect(result).toEqual(updated);
            });
            it('should persist the updated trip', async () => {
                const trip = createTestTrip();
                await repo.create(trip);
                const updated = { ...trip, distanceMeters: 1000, title: 'Updated Trip' };
                await repo.update(updated);
                const retrieved = await repo.findById(trip.id);
                expect(retrieved).toEqual(updated);
            });
        });
        describe('findById', () => {
            it('should return a trip when it exists', async () => {
                const trip = createTestTrip();
                await repo.create(trip);
                const result = await repo.findById(trip.id);
                expect(result).toEqual(trip);
            });
            it('should return null when trip does not exist', async () => {
                const result = await repo.findById('nonexistent-id');
                expect(result).toBeNull();
            });
        });
        describe('getActive', () => {
            it('should return active trip when one exists', async () => {
                const activeTrip = createTestTrip({ status: 'active' });
                const completedTrip = createTestTrip({ id: 'completed', status: 'completed' });
                await repo.create(activeTrip);
                await repo.create(completedTrip);
                const result = await repo.getActive();
                expect(result).toEqual(activeTrip);
            });
            it('should return null when no active trip exists', async () => {
                const completedTrip = createTestTrip({ status: 'completed' });
                await repo.create(completedTrip);
                const result = await repo.getActive();
                expect(result).toBeNull();
            });
        });
        describe('list', () => {
            it('should return trips sorted by startAt descending', async () => {
                const trip1 = createTestTrip({ id: 'trip1', startAt: 1000 });
                const trip2 = createTestTrip({ id: 'trip2', startAt: 2000 });
                const trip3 = createTestTrip({ id: 'trip3', startAt: 1500 });
                await repo.create(trip1);
                await repo.create(trip2);
                await repo.create(trip3);
                const result = await repo.list();
                expect(result.map(t => t.id)).toEqual(['trip2', 'trip3', 'trip1']);
            });
            it('should respect limit parameter', async () => {
                const trip1 = createTestTrip({ id: 'trip1', startAt: 1000 });
                const trip2 = createTestTrip({ id: 'trip2', startAt: 2000 });
                await repo.create(trip1);
                await repo.create(trip2);
                const result = await repo.list({ limit: 1 });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('trip2');
            });
            it('should respect offset parameter', async () => {
                const trip1 = createTestTrip({ id: 'trip1', startAt: 1000 });
                const trip2 = createTestTrip({ id: 'trip2', startAt: 2000 });
                await repo.create(trip1);
                await repo.create(trip2);
                const result = await repo.list({ offset: 1 });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('trip1');
            });
            it('should filter by date range', async () => {
                const trip1 = createTestTrip({ id: 'trip1', startAt: 1000 });
                const trip2 = createTestTrip({ id: 'trip2', startAt: 2000 });
                const trip3 = createTestTrip({ id: 'trip3', startAt: 3000 });
                await repo.create(trip1);
                await repo.create(trip2);
                await repo.create(trip3);
                const result = await repo.list({ from: 1500, to: 2500 });
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('trip2');
            });
            it('should return empty array when no trips exist', async () => {
                const result = await repo.list();
                expect(result).toEqual([]);
            });
        });
        describe('data immutability', () => {
            it('should return independent copies of trips', async () => {
                const trip = createTestTrip();
                await repo.create(trip);
                const retrieved1 = await repo.findById(trip.id);
                const retrieved2 = await repo.findById(trip.id);
                // Modify one copy
                retrieved1.distanceMeters = 999;
                // Other copy should be unchanged
                expect(retrieved2.distanceMeters).toBe(trip.distanceMeters);
            });
        });
    });
}

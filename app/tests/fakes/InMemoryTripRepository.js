"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTripRepository = void 0;
class InMemoryTripRepository {
    constructor() {
        this.store = new Map();
    }
    async create(trip) {
        this.store.set(trip.id, { ...trip });
        return { ...trip };
    }
    async update(trip) {
        this.store.set(trip.id, { ...trip });
        return { ...trip };
    }
    async findById(id) {
        const t = this.store.get(id);
        return t ? { ...t } : null;
    }
    async getActive() {
        for (const t of this.store.values()) {
            if (t.status === 'active')
                return { ...t };
        }
        return null;
    }
    async list(params) {
        let items = Array.from(this.store.values()).sort((a, b) => b.startAt - a.startAt);
        if (params?.from)
            items = items.filter(t => t.startAt >= params.from);
        if (params?.to)
            items = items.filter(t => t.startAt <= params.to);
        if (params?.offset)
            items = items.slice(params.offset);
        if (params?.limit)
            items = items.slice(0, params.limit);
        return items.map(t => ({ ...t }));
    }
}
exports.InMemoryTripRepository = InMemoryTripRepository;

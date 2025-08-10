"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterLocationFixes_1 = require("@models/use-cases/FilterLocationFixes");
describe('filterFixes', () => {
    const p = (lon, ts, accuracy = 5) => ({ lat: 0, lon, timestamp: ts, accuracy });
    it('drops bad accuracy', () => {
        const r = (0, FilterLocationFixes_1.filterFixes)([p(0, 0), p(0.001, 1000, 200)]);
        expect(r.length).toBe(1);
    });
    it('drops non-monotonic timestamps', () => {
        const r = (0, FilterLocationFixes_1.filterFixes)([p(0, 1000), p(0.001, 900)]);
        expect(r.length).toBe(1);
    });
    it('drops unrealistic speed segments', () => {
        const r = (0, FilterLocationFixes_1.filterFixes)([p(0, 0), p(1, 1000)]);
        expect(r.length).toBe(1);
    });
});

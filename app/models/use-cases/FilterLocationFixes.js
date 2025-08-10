"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterFixes = filterFixes;
function filterFixes(points, opts = {}) {
    const maxAcc = opts.maxHorizontalAccuracyMeters ?? 50;
    const maxSpeed = opts.maxReasonableSpeedMps ?? 60;
    const result = [];
    let prev;
    for (const p of points) {
        if (p.accuracy > maxAcc)
            continue;
        if (!prev) {
            result.push(p);
            prev = p;
            continue;
        }
        const dt = (p.timestamp - prev.timestamp) / 1000;
        if (dt <= 0) {
            // drop non-monotonic
            prev = p;
            continue;
        }
        const dMeters = haversineMeters(prev, p);
        const speed = dMeters / dt;
        if (speed > maxSpeed) {
            prev = p;
            continue;
        }
        result.push(p);
        prev = p;
    }
    return result;
}
function haversineMeters(a, b) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const aa = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
}

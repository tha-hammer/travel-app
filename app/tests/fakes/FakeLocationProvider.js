"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeLocationProvider = void 0;
class FakeLocationProvider {
    async requestWhenInUse() {
        return 'granted';
    }
    async requestAlways() {
        return 'granted';
    }
    start(onFix) {
        this.handler = onFix;
    }
    stop() {
        this.handler = undefined;
    }
    emit(fix) {
        this.handler?.(fix);
    }
}
exports.FakeLocationProvider = FakeLocationProvider;

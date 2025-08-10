"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTemplateRepository = void 0;
class InMemoryTemplateRepository {
    constructor() {
        this.store = new Map();
    }
    async upsert(template) {
        this.store.set(template.id, { ...template });
        return { ...template };
    }
    async list() {
        const templates = Array.from(this.store.values())
            .sort((a, b) => a.title.localeCompare(b.title));
        return templates.map(t => ({ ...t }));
    }
    async findById(id) {
        const template = this.store.get(id);
        return template ? { ...template } : null;
    }
}
exports.InMemoryTemplateRepository = InMemoryTemplateRepository;

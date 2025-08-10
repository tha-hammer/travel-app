import { RoutineTripTemplate } from '@models/entities/RoutineTripTemplate';
import { TemplateRepository } from '@models/repositories/TemplateRepository';

export function templateRepositoryContractTests(
  createRepository: () => TemplateRepository,
  cleanup?: () => Promise<void>
) {
  describe('TemplateRepository Contract Tests', () => {
    let repo: TemplateRepository;

    beforeEach(() => {
      repo = createRepository();
    });

    afterEach(async () => {
      if (cleanup) await cleanup();
    });

    describe('upsert', () => {
      it('should create new template when it does not exist', async () => {
        const template = createTestTemplate();
        
        const result = await repo.upsert(template);
        
        expect(result).toEqual(template);
      });

      it('should update existing template when it exists', async () => {
        const template = createTestTemplate();
        await repo.upsert(template);
        
        const updated = { ...template, title: 'Updated Template', notes: 'Updated notes' };
        const result = await repo.upsert(updated);
        
        expect(result).toEqual(updated);
      });

      it('should persist the template for later retrieval', async () => {
        const template = createTestTemplate();
        
        await repo.upsert(template);
        const templates = await repo.list();
        
        expect(templates).toContainEqual(template);
      });
    });

    describe('list', () => {
      it('should return all templates', async () => {
        const template1 = createTestTemplate({ id: 'template1', title: 'Template 1' });
        const template2 = createTestTemplate({ id: 'template2', title: 'Template 2' });
        
        await repo.upsert(template1);
        await repo.upsert(template2);
        
        const result = await repo.list();
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(template1);
        expect(result).toContainEqual(template2);
      });

      it('should return empty array when no templates exist', async () => {
        const result = await repo.list();
        
        expect(result).toEqual([]);
      });

      it('should sort templates by title', async () => {
        const template1 = createTestTemplate({ id: 'template1', title: 'Z Template' });
        const template2 = createTestTemplate({ id: 'template2', title: 'A Template' });
        const template3 = createTestTemplate({ id: 'template3', title: 'M Template' });
        
        await repo.upsert(template1);
        await repo.upsert(template2);
        await repo.upsert(template3);
        
        const result = await repo.list();
        
        expect(result.map(t => t.title)).toEqual(['A Template', 'M Template', 'Z Template']);
      });
    });

    describe('data immutability', () => {
      it('should return independent copies of templates', async () => {
        const template = createTestTemplate();
        await repo.upsert(template);
        
        const list1 = await repo.list();
        const list2 = await repo.list();
        
        // Modify one copy
        list1[0].title = 'Modified';
        
        // Other copy should be unchanged
        expect(list2[0].title).toBe(template.title);
      });
    });

    describe('edge cases', () => {
      it('should handle templates with optional fields', async () => {
        const template = createTestTemplate({ notes: undefined, category: undefined });
        
        const result = await repo.upsert(template);
        
        expect(result.notes).toBeUndefined();
        expect(result.category).toBeUndefined();
      });

      it('should handle templates with all fields populated', async () => {
        const template = createTestTemplate({ 
          notes: 'Test notes', 
          category: 'Business' 
        });
        
        const result = await repo.upsert(template);
        
        expect(result.notes).toBe('Test notes');
        expect(result.category).toBe('Business');
      });
    });
  });
}
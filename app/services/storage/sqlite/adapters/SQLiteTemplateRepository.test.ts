import { templateRepositoryContractTests } from '@tests/contracts/TemplateRepository.contract';
import { openDatabase } from './SQLiteInit';
import { SQLiteTemplateRepository } from './SQLiteTemplateRepository';

describe('SQLiteTemplateRepository', () => {
  let repository: SQLiteTemplateRepository;
  let db: any;

  beforeEach(async () => {
    db = openDatabase(':memory:');
    repository = new SQLiteTemplateRepository(db);
  });

  afterEach(() => {
    if (db) {
      db.close();
    }
  });

  // Run the contract tests
  templateRepositoryContractTests(
    () => repository,
    async () => {
      // Cleanup is handled in afterEach
    }
  );
});
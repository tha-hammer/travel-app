import { templateRepositoryContractTests } from '@tests/contracts/TemplateRepository.contract';
import { SQLiteDatabase } from '../SQLiteDatabase';
import { SQLiteTemplateRepository } from './SQLiteTemplateRepository';
import { join } from 'path';

const TEST_DB_PATH = ':memory:'; // Use in-memory database for tests

describe('SQLiteTemplateRepository', () => {
  let db: SQLiteDatabase;
  let repository: SQLiteTemplateRepository;

  beforeEach(async () => {
    db = new SQLiteDatabase({ filename: TEST_DB_PATH });
    await db.runMigrations(join(__dirname, '..', 'migrations'));
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
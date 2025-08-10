import { tripRepositoryContractTests } from '@tests/contracts/TripRepository.contract';
import { SQLiteDatabase } from '../SQLiteDatabase';
import { SQLiteTripRepository } from './SQLiteTripRepository';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

const TEST_DB_PATH = ':memory:'; // Use in-memory database for tests

describe('SQLiteTripRepository', () => {
  let db: SQLiteDatabase;
  let repository: SQLiteTripRepository;

  beforeEach(async () => {
    db = new SQLiteDatabase({ filename: TEST_DB_PATH });
    await db.runMigrations(join(__dirname, '..', 'migrations'));
    repository = new SQLiteTripRepository(db);
  });

  afterEach(() => {
    if (db) {
      db.close();
    }
  });

  // Run the contract tests
  tripRepositoryContractTests(
    () => repository,
    async () => {
      // Cleanup is handled in afterEach
    }
  );
});
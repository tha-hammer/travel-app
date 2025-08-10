import { tripRepositoryContractTests } from '@tests/contracts/TripRepository.contract';
import { openDatabase } from './SQLiteInit';
import { SQLiteTripRepository } from './SQLiteTripRepository';

describe('SQLiteTripRepository', () => {
  let repository: SQLiteTripRepository;
  let db: any;

  beforeEach(async () => {
    db = openDatabase(':memory:');
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
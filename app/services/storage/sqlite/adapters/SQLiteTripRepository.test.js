"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TripRepository_contract_1 = require("@tests/contracts/TripRepository.contract");
const SQLiteInit_1 = require("./SQLiteInit");
const SQLiteTripRepository_1 = require("./SQLiteTripRepository");
describe('SQLiteTripRepository', () => {
    let repository;
    let db;
    beforeEach(async () => {
        db = (0, SQLiteInit_1.openDatabase)(':memory:');
        repository = new SQLiteTripRepository_1.SQLiteTripRepository(db);
    });
    afterEach(() => {
        if (db) {
            db.close();
        }
    });
    // Run the contract tests
    (0, TripRepository_contract_1.tripRepositoryContractTests)(() => repository, async () => {
        // Cleanup is handled in afterEach
    });
});

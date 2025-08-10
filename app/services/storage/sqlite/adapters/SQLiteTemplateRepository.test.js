"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TemplateRepository_contract_1 = require("@tests/contracts/TemplateRepository.contract");
const SQLiteInit_1 = require("./SQLiteInit");
const SQLiteTemplateRepository_1 = require("./SQLiteTemplateRepository");
describe('SQLiteTemplateRepository', () => {
    let repository;
    let db;
    beforeEach(async () => {
        db = (0, SQLiteInit_1.openDatabase)(':memory:');
        repository = new SQLiteTemplateRepository_1.SQLiteTemplateRepository(db);
    });
    afterEach(() => {
        if (db) {
            db.close();
        }
    });
    // Run the contract tests
    (0, TemplateRepository_contract_1.templateRepositoryContractTests)(() => repository, async () => {
        // Cleanup is handled in afterEach
    });
});

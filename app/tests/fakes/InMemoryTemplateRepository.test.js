"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryTemplateRepository_1 = require("./InMemoryTemplateRepository");
const TemplateRepository_contract_1 = require("../contracts/TemplateRepository.contract");
// Test that the in-memory implementation satisfies the contract
(0, TemplateRepository_contract_1.templateRepositoryContractTests)(() => new InMemoryTemplateRepository_1.InMemoryTemplateRepository());

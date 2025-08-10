"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryTripRepository_1 = require("./InMemoryTripRepository");
const TripRepository_contract_1 = require("../contracts/TripRepository.contract");
// Test that the in-memory implementation satisfies the contract
(0, TripRepository_contract_1.tripRepositoryContractTests)(() => new InMemoryTripRepository_1.InMemoryTripRepository());

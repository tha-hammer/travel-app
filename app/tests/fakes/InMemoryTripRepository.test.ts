import { InMemoryTripRepository } from './InMemoryTripRepository';
import { tripRepositoryContractTests } from '../contracts/TripRepository.contract';

// Test that the in-memory implementation satisfies the contract
tripRepositoryContractTests(() => new InMemoryTripRepository());
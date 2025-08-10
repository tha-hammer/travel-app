import { InMemoryTemplateRepository } from './InMemoryTemplateRepository';
import { templateRepositoryContractTests } from '../contracts/TemplateRepository.contract';

// Test that the in-memory implementation satisfies the contract
templateRepositoryContractTests(() => new InMemoryTemplateRepository());
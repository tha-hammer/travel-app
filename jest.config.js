/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app'],
  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.ts',
    '<rootDir>/app/**/*.test.ts',
    '<rootDir>/app/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/app/models/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
    '^@views/(.*)$': '<rootDir>/app/views/$1',
    '^@tests/(.*)$': '<rootDir>/app/tests/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1'
  },
  collectCoverageFrom: [
    'app/**/*.ts',
    '!app/**/*.d.ts',
    '!app/tests/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/app/tests/setup.ts']
};
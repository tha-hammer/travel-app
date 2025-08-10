module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app/tests'],
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/app/models/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
    '^@views/(.*)$': '<rootDir>/app/views/$1',
    '^@tests/(.*)$': '<rootDir>/app/tests/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1',
  },
};

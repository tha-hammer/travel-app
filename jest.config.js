/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'node-tests',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/app'],
      testMatch: [
        '<rootDir>/app/**/*.test.ts',
        '<rootDir>/app/**/*.spec.ts'
      ],
      moduleNameMapper: {
        '^@models/(.*)$': '<rootDir>/app/models/$1',
        '^@services/(.*)$': '<rootDir>/app/services/$1',
        '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
        '^@views/(.*)$': '<rootDir>/app/views/$1',
        '^@tests/(.*)$': '<rootDir>/app/tests/$1'
      },
      setupFilesAfterEnv: ['<rootDir>/app/tests/setup.ts'],
      moduleNameMapper: {
        '^@models/(.*)$': '<rootDir>/app/models/$1',
        '^@services/(.*)$': '<rootDir>/app/services/$1',
        '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
        '^@views/(.*)$': '<rootDir>/app/views/$1',
        '^@tests/(.*)$': '<rootDir>/app/tests/$1',
        '^react-native-sqlite-storage$': '<rootDir>/app/tests/mocks/react-native-sqlite-storage.js'
      },
      collectCoverageFrom: [
        'app/**/*.ts',
        '!app/**/*.d.ts',
        '!app/tests/**/*'
      ]
    },
    {
      displayName: 'react-tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/app'],
      testMatch: [
        '<rootDir>/app/**/*.test.tsx',
        '<rootDir>/app/**/*.spec.tsx'
      ],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            jsx: 'react-jsx'
          }
        }]
      },
      moduleNameMapper: {
        '^@models/(.*)$': '<rootDir>/app/models/$1',
        '^@services/(.*)$': '<rootDir>/app/services/$1',
        '^@controllers/(.*)$': '<rootDir>/app/controllers/$1',
        '^@views/(.*)$': '<rootDir>/app/views/$1',
        '^@tests/(.*)$': '<rootDir>/app/tests/$1'
      },
      setupFilesAfterEnv: ['<rootDir>/app/tests/setup.ts'],
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-paper)/)',
      ]
    }
  ]
};
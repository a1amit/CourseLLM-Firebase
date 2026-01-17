/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // Only look for tests in src/ directory, exclude tests/ (Playwright tests)
    testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
    testPathIgnorePatterns: ['/node_modules/', '/tests/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = config;

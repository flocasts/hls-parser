import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\\.spec.ts$',
    setupFilesAfterEnv: ['jest-extended/all'],
    collectCoverageFrom: ['./src/**'],
};

export default config;

export const preset = 'ts-jest';
export const testEnvironment = 'jsdom';
export const testPathIgnorePatterns = ['/node_modules/', '/dist/'];
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
};
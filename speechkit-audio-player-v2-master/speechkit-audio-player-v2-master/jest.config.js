module.exports = {
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.spec.js',
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/*.mocks.js',
    '!coverage/**/*',
    '!**/*.config.js',
    '!jest.config.js',
    '!config/*.js',
    '!scripts/*.js',
    '!**/build/**/*',
    '!**/demo/**/*',
    '!**/tmp/**/*',
    '!**/mocks/**/*',
  ],
  moduleFileExtensions: ['js', 'json'],
  modulePaths: [
    '<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupFiles: [
    '<rootDir>/config/test-setup.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/test-framework-setup.js',
  ],
  transform: {
    '^.+\\.[t|j]s?$': 'babel-jest',
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './reports/junit' }],
  ],
}

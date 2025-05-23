module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
/** @type {import("jest").Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ['ts-jest', { /* ts-jest config goes here in Jest */ }],
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
};

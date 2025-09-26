// jest.config.js
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  testMatch: ["**/tests/**/*.test.ts"],
  transform: tsJestTransformCfg,
  moduleFileExtensions: ["ts", "js", "json", "node"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
};

/*
 * See https://jestjs.io/docs/configuration
 */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  verbose: true,
  bail: 1,
  testRegex: 'test/*.ts',
};
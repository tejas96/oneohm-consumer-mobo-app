const rnJestPreset = require('@react-native/jest-preset/jest-preset');

module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    require.resolve('react-native-gesture-handler/jestSetup'),
    ...rnJestPreset.setupFiles,
  ],
  // Dependencies under node_modules often ship modern syntax; allow babel-jest to transform
  // react-native-* packages, @react-navigation/*, @tanstack/*, etc.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native-[\\w.-]+|@react-native(-community)?|@react-native-async-storage|@react-navigation|@tanstack|zustand)/)',
  ],
};

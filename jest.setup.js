/* global jest */
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve(null)),
    multiRemove: jest.fn(() => Promise.resolve(null)),
    multiMerge: jest.fn(() => Promise.resolve(null)),
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockSvg = props => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Circle: MockSvg,
    Defs: MockSvg,
    LinearGradient: MockSvg,
    Stop: MockSvg,
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: props => React.createElement(View, props, props.children),
    BottomSheetScrollView: props =>
      React.createElement(View, props, props.children),
    BottomSheetBackdrop: () => null,
  };
});

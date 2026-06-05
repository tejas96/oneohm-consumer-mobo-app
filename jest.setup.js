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
    Mask: MockSvg,
    Path: MockSvg,
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

// React Native Firebase App & Messaging mocks for Jest
jest.mock('@react-native-firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    app: jest.fn(() => ({
      options: {},
    })),
  };
});

jest.mock('@react-native-firebase/messaging', () => {
  const mockMessagingInstance = {
    requestPermission: jest.fn(() => Promise.resolve(1)), // AUTHORIZED
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    onTokenRefresh: jest.fn(() => jest.fn()),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  };

  const messaging = jest.fn(() => mockMessagingInstance);

  messaging.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };

  return {
    __esModule: true,
    default: messaging,
    getMessaging: jest.fn(() => mockMessagingInstance),
  };
});

// React Native Reanimated mock
jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: component => component,
    },
    useSharedValue: val => ({ value: val }),
    useAnimatedProps: cb => cb(),
    useFrameCallback: jest.fn(),
  };
});

// React Native Worklets mock
jest.mock('react-native-worklets', () => {
  return {
    Worklets: {
      createRunOnJS: fn => fn,
      createRunOnWorklet: fn => fn,
    },
    createSerializable: val => val,
  };
});

// React Native Blob Util mock
jest.mock('react-native-blob-util', () => {
  return {
    default: {
      fs: {
        dirs: {
          DocumentDir: '',
          DownloadDir: '',
        },
      },
    },
  };
});

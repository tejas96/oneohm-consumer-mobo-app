/**
 * Navigation Module — Public API
 *
 * Everything navigation-related is imported from here.
 */

// Route Enum
export { Route } from './routes';

// Types
export type {
  AuthStackParamList,
  MainStackParamList,
  MainTabParamList,
  RootParamList,
  ScreenProps,
  OtpParams,
  ProjectDetailParams,
} from './navigation.types';

// Hooks
export { useAppNavigation, useRoutes } from './hooks';

// Screen Config
export {
  defaultScreenOptions,
  getScreenOptions,
  screenConfigs,
} from './screen-config';

// Navigators
export { RootNavigator } from './RootNavigator';
export { AuthNavigator } from './AuthNavigator';
export { MainNavigator } from './MainNavigator';

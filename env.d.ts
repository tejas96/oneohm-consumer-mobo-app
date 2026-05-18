/**
 * Type declarations for environment variables loaded via react-native-dotenv.
 * Import as: import { API_URL } from '@env';
 */
declare module '@env' {
  export const API_URL: string;
  export const API_TIMEOUT: string;
  export const APP_NAME: string;
  export const APP_ENV: string;
  export const ENABLE_ANALYTICS: string;
  export const ENABLE_CRASH_REPORTING: string;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { IconProps } from 'react-native-vector-icons/Icon';
  export default class MaterialCommunityIcons extends Component<IconProps> {}
}

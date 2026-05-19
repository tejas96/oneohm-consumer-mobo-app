import { en } from './locales/en';

export type Language = 'en' | 'mr';

// The English dictionary serves as the master type for all other languages
export type Dictionary = typeof en;

// Utility type to extract all possible dot-notation paths from the Dictionary
// Example: 'auth.languageSelect' | 'common.loading'
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type TranslationKey = Join<PathsToStringProps<Dictionary>, '.'>;

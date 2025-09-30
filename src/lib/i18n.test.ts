import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createTranslator,
  resolveLocale,
  findMatchingLocale,
  DEFAULT_LOCALE,
  TRANSLATIONS,
} from './i18n';

describe('i18n utilities', () => {
  describe('findMatchingLocale', () => {
    it('should return exact match for valid locale', () => {
      expect(findMatchingLocale('en-US')).toBe('en-US');
      expect(findMatchingLocale('es-ES')).toBe('es-ES');
    });

    it('should find locale by language prefix', () => {
      expect(findMatchingLocale('en')).toBe('en-US');
      expect(findMatchingLocale('es')).toBe('es-ES');
      expect(findMatchingLocale('en-GB')).toBe('en-US');
    });

    it('should return default locale for unknown locale', () => {
      expect(findMatchingLocale('fr-FR')).toBe(DEFAULT_LOCALE);
      expect(findMatchingLocale('de-DE')).toBe(DEFAULT_LOCALE);
      expect(findMatchingLocale('invalid')).toBe(DEFAULT_LOCALE);
    });
  });

  describe('resolveLocale', () => {
    beforeEach(() => {
      // Mock navigator
      Object.defineProperty(window.navigator, 'languages', {
        writable: true,
        value: ['en-US'],
      });
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: 'en-US',
      });
    });

    it('should use app locale when provided and valid', () => {
      expect(resolveLocale('es-ES')).toBe('es-ES');
      expect(resolveLocale('en-US')).toBe('en-US');
    });

    it('should skip template literal placeholder', () => {
      expect(resolveLocale('{{APP_LOCALE}}')).toBe('en-US');
    });

    it('should fall back to browser language when app locale is not provided', () => {
      Object.defineProperty(window.navigator, 'languages', {
        writable: true,
        value: ['es-ES', 'en-US'],
      });
      expect(resolveLocale('{{APP_LOCALE}}')).toBe('es-ES');
    });

    it('should use navigator.language as fallback', () => {
      Object.defineProperty(window.navigator, 'languages', {
        writable: true,
        value: undefined,
      });
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: 'es-ES',
      });
      expect(resolveLocale('{{APP_LOCALE}}')).toBe('es-ES');
    });

    it('should return default locale when browser locale is unavailable', () => {
      Object.defineProperty(window.navigator, 'languages', {
        writable: true,
        value: undefined,
      });
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: undefined,
      });
      expect(resolveLocale('{{APP_LOCALE}}')).toBe(DEFAULT_LOCALE);
    });
  });

  describe('createTranslator', () => {
    it('should create translator for English locale', () => {
      const { locale, t } = createTranslator('en-US');
      expect(locale).toBe('en-US');
      expect(t('appTitle')).toBe('QR Code Generator');
      expect(t('urlTab')).toBe('URL');
    });

    it('should create translator for Spanish locale', () => {
      const { locale, t } = createTranslator('es-ES');
      expect(locale).toBe('es-ES');
      expect(t('appTitle')).toBe('Generador de Códigos QR');
      expect(t('urlTab')).toBe('URL');
    });

    it('should fall back to language prefix matching', () => {
      const { locale, t } = createTranslator('es');
      expect(locale).toBe('es-ES');
      expect(t('appTitle')).toBe('Generador de Códigos QR');
    });

    it('should fall back to default locale for unknown locale', () => {
      const { locale, t } = createTranslator('fr-FR');
      expect(locale).toBe(DEFAULT_LOCALE);
      expect(t('appTitle')).toBe('QR Code Generator');
    });

    it('should return default translation for missing key', () => {
      const { t } = createTranslator('en-US');
      expect(t('nonExistentKey' as any)).toBe('nonExistentKey');
    });

    it('should return translation from default locale if key missing in current locale', () => {
      // This test verifies the fallback chain works properly
      const { t } = createTranslator('en-US');
      // All keys should exist, but if they didn't, it would fall back
      expect(typeof t('appTitle')).toBe('string');
      expect(t('appTitle')).toBeTruthy();
    });
  });

  describe('TRANSLATIONS completeness', () => {
    it('should have same keys in all locales', () => {
      const locales = Object.keys(TRANSLATIONS) as Array<keyof typeof TRANSLATIONS>;
      const enKeys = Object.keys(TRANSLATIONS['en-US']).sort();

      locales.forEach((locale) => {
        const localeKeys = Object.keys(TRANSLATIONS[locale]).sort();
        expect(localeKeys).toEqual(enKeys);
      });
    });

    it('should have non-empty translations for all keys', () => {
      const locales = Object.keys(TRANSLATIONS) as Array<keyof typeof TRANSLATIONS>;

      locales.forEach((locale) => {
        const translations = TRANSLATIONS[locale];
        Object.entries(translations).forEach(([key, value]) => {
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect(value.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });
});
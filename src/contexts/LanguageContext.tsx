import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';
import {
  defaultLanguage,
  getTranslation,
  type LanguageCode,
  type TranslationKey,
} from '../i18n/translations';
import { fetchUserSettings } from '../services/userSettingsService';
import { useAuth } from './AuthContext';

interface LanguageContextValue {
  language: LanguageCode;
  t: (
    key: TranslationKey,
    options?: { fallback?: string; values?: Record<string, string | number> }
  ) => string;
  translate: (esText: string, enText: string) => string;
  locale: string;
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  setLanguageInstant: (lang: LanguageCode) => void;
  changeLanguage: (lang: LanguageCode) => Promise<void>;
  isSwitching: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = 'pwa_clinica_language';

const resolveStoredLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return defaultLanguage;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'es' ? stored : defaultLanguage;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(resolveStoredLanguage);
  const [isSwitching, setIsSwitching] = useState(false);
  const { user } = useAuth();
  const languageRef = useRef(language);
  const locale = language === 'en' ? 'en-US' : 'es-MX';

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguageInstant = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
  }, []);

  const changeLanguage = useCallback(
    async (lang: LanguageCode) => {
      if (lang === language) return;
      setIsSwitching(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLanguageInstant(lang);
      setTimeout(() => setIsSwitching(false), 350);
    },
    [language, setLanguageInstant]
  );

  useEffect(() => {
    let active = true;
    const syncPreferredLanguage = async () => {
      if (!user?.id) return;
      try {
        const settings = await fetchUserSettings(user.id);
        const preferred = settings.language === 'en' ? 'en' : 'es';
        if (active && preferred !== languageRef.current) {
          setLanguageInstant(preferred);
        }
      } catch (error) {
        console.warn('No se pudo sincronizar el idioma preferido', error);
      }
    };

    syncPreferredLanguage();
    return () => {
      active = false;
    };
  }, [user?.id, setLanguageInstant]);

  const t = useCallback(
    (key: TranslationKey, options?: { fallback?: string; values?: Record<string, string | number> }) =>
      getTranslation(key, language, options),
    [language]
  );

  const translate = useCallback(
    (esText: string, enText: string) => (language === 'es' ? esText : enText),
    [language]
  );

  const formatCurrency = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
        ...options,
      }).format(value ?? 0),
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value ?? 0),
    [locale]
  );

  const value = useMemo(
    () => ({
      language,
      t,
      translate,
      locale,
      formatCurrency,
      formatNumber,
      setLanguageInstant,
      changeLanguage,
      isSwitching,
    }),
    [language, t, translate, locale, formatCurrency, formatNumber, setLanguageInstant, changeLanguage, isSwitching]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {isSwitching && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-semibold">{t('language.switchingTitle')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('language.switchingSubtitle')}
              </p>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  }
  return context;
}

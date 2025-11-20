export type LanguageCode = 'es' | 'en';

const es = {
  'app.verifyingSession': 'Verificando sesión...',
  'app.loggingOut': 'Cerrando sesión...',
  'language.switchingTitle': 'Aplicando idioma',
  'language.switchingSubtitle': 'Actualizando preferencias lingüísticas, por favor espera...',
  'language.syncing': 'Sincronizando idioma preferido…',
  'common.cancel': 'Cancelar',
  'common.saveChanges': 'Guardar cambios',
  'common.refresh': 'Recargar datos',
  'common.back': 'Volver',
  'common.loading': 'Cargando...',
  'common.language.es': 'Español',
  'common.language.en': 'Inglés',
  'sidebar.systemName': 'Clínica Juan Carlos',
  'sidebar.systemOwner': 'Ojeda Gallardo',
  'sidebar.systemSubtitle': 'Sistema de Inventario',
  'sidebar.defaultUser': 'Usuario',
  'sidebar.defaultRole': 'Administrador',
  'sidebar.menu.dashboard': 'Dashboard',
  'sidebar.menu.inventario': 'Inventario',
  'sidebar.menu.alertas': 'Alertas',
  'sidebar.menu.analisis': 'Análisis',
  'sidebar.menu.reportes': 'Reportes',
  'sidebar.menu.configuracion': 'Configuración',
  'sidebar.menu.ayuda': 'Ayuda',
  'sidebar.menu.logout': 'Cerrar sesión',
  'header.greeting': 'Hola, {{name}}',
  'header.defaultUser': 'Usuario',
  'header.searchPlaceholder': 'Buscar sección (ej. inventario)',
  'header.searchEmpty': 'Escribe una sección para navegar.',
  'header.searchNotFound': 'No encontré esa sección. Prueba con inventario, reportes, etc.',
  'header.quickSearchPrompt': '¿A qué sección deseas ir? (ej. inventario)',
  'header.alertsTitle': 'Centro de alertas',
  'header.alertsSubtitle': 'Monitorea inventario en tiempo real',
  'header.loadingAlerts': 'Cargando alertas...',
  'header.noAlerts': 'No hay alertas pendientes',
  'header.markRead': 'Marcar leído',
  'header.clear': 'Limpiar',
  'header.openAlerts': 'Ver Centro de Alertas',
  'config.title': 'Configuración',
  'config.subtitle': 'Personaliza tu experiencia y ajusta las preferencias del sistema',
  'config.refresh': 'Recargar datos',
  'config.success': 'Configuración actualizada correctamente',
  'config.language.label': 'Idioma',
  'config.language.description': 'Selecciona el idioma principal de la aplicación',
  'config.save': 'Guardar configuraciones',
  'config.cancel': 'Cancelar',
} as const;

const en: { [K in keyof typeof es]: string } = {
  'app.verifyingSession': 'Verifying session...',
  'app.loggingOut': 'Signing out...',
  'language.switchingTitle': 'Applying language',
  'language.switchingSubtitle': 'Updating language preferences, please wait...',
  'language.syncing': 'Syncing preferred language…',
  'common.cancel': 'Cancel',
  'common.saveChanges': 'Save changes',
  'common.refresh': 'Reload data',
  'common.back': 'Back',
  'common.loading': 'Loading...',
  'common.language.es': 'Spanish',
  'common.language.en': 'English',
  'sidebar.systemName': 'Juan Carlos Clinic',
  'sidebar.systemOwner': 'Ojeda Gallardo',
  'sidebar.systemSubtitle': 'Inventory System',
  'sidebar.defaultUser': 'User',
  'sidebar.defaultRole': 'Administrator',
  'sidebar.menu.dashboard': 'Dashboard',
  'sidebar.menu.inventario': 'Inventory',
  'sidebar.menu.alertas': 'Alerts',
  'sidebar.menu.analisis': 'Analytics',
  'sidebar.menu.reportes': 'Reports',
  'sidebar.menu.configuracion': 'Settings',
  'sidebar.menu.ayuda': 'Help',
  'sidebar.menu.logout': 'Log out',
  'header.greeting': 'Hello, {{name}}',
  'header.defaultUser': 'User',
  'header.searchPlaceholder': 'Search a section (e.g. inventory)',
  'header.searchEmpty': 'Type a section to navigate.',
  'header.searchNotFound': 'Section not found. Try inventory, reports, etc.',
  'header.quickSearchPrompt': 'Which section do you want to open? (e.g. inventory)',
  'header.alertsTitle': 'Alerts Center',
  'header.alertsSubtitle': 'Monitor inventory in real time',
  'header.loadingAlerts': 'Loading alerts...',
  'header.noAlerts': 'No pending alerts',
  'header.markRead': 'Mark as read',
  'header.clear': 'Clear',
  'header.openAlerts': 'Open Alerts Center',
  'config.title': 'Settings',
  'config.subtitle': 'Personalise your experience and adjust system preferences',
  'config.refresh': 'Reload data',
  'config.success': 'Settings updated successfully',
  'config.language.label': 'Language',
  'config.language.description': 'Select the main language for the application',
  'config.save': 'Save settings',
  'config.cancel': 'Cancel',
} as const;

export type TranslationKey = keyof typeof es;

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  es,
  en,
};

export const defaultLanguage: LanguageCode = 'es';

function interpolate(template: string, values?: Record<string, string | number>) {
  if (!values) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = values[key.trim()];
    return value === undefined ? '' : String(value);
  });
}

export function getTranslation(
  key: TranslationKey,
  language: LanguageCode,
  options?: { fallback?: string; values?: Record<string, string | number> }
) {
  const dictionary = translations[language] ?? translations[defaultLanguage];
  const template = dictionary[key] ?? translations[defaultLanguage][key] ?? options?.fallback ?? key;
  return interpolate(template, options?.values);
}

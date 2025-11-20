import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  RefreshCcw,
  Loader2,
  Mail,
  Phone,
  User,
  Globe,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useAuth } from '../../contexts/AuthContext';
import { useUserSettings } from '../../hooks/useUserSettings';
import { useLanguage } from '../../contexts/LanguageContext';
import type { LanguageCode } from '../../i18n/translations';

const roleOptions = [
  { value: 'Administrador', es: 'Administrador', en: 'Administrator' },
  { value: 'Farmacéutico', es: 'Farmacéutico', en: 'Pharmacist' },
  { value: 'Almacén', es: 'Almacén', en: 'Warehouse' },
  { value: 'Auditor', es: 'Auditor', en: 'Auditor' },
];
const currencyOptions = ['MXN', 'USD', 'EUR'];
const timezoneOptions = [
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Chicago',
];
const dateFormatOptions = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const languageOptions = ['es', 'en'];

export function ConfiguracionSection() {
  const { user, resetPassword } = useAuth();
  const {
    settings,
    loading,
    saving,
    error,
    success,
    update,
    persist,
    refresh,
  } = useUserSettings(user?.id);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const { language, changeLanguage, translate } = useLanguage();

  const handleSave = async () => {
    const targetLanguage = (settings.language as LanguageCode) ?? 'es';
    await persist();
    if (targetLanguage !== language) {
      await changeLanguage(targetLanguage);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setPasswordMessage(null);
      await resetPassword(user.email);
      setPasswordMessage(
        translate(
          'Te enviamos un enlace para restablecer tu contraseña.',
          'We sent you a link to reset your password.'
        )
      );
    } catch (err: any) {
      const message =
        err instanceof Error
          ? err.message
          : translate(
              'No se pudo enviar el enlace de seguridad.',
              'We could not send the security email.'
            );
      setPasswordMessage(message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
            {translate('Configuración', 'Settings')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
            {translate(
              'Personaliza tu experiencia y ajusta las preferencias del sistema',
              'Personalise your experience and adjust system preferences'
            )}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-sm"
          onClick={() => refresh()}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          {translate('Recargar datos', 'Reload data')}
        </Button>
      </motion.div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-300">
          {success}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 shadow border border-white/40 dark:border-slate-700/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {translate('Perfil de Usuario', 'User Profile')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translate(
                'Tu información personal sincronizada con Supabase Auth',
                'Your personal information synced from Supabase Auth'
              )}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Nombre completo', 'Full name')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={settings.fullName}
                onChange={(event) => update({ fullName: event.target.value })}
                className="pl-9"
                placeholder={translate('Nombre y apellidos', 'First and last name')}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Correo', 'Email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input value={user?.email ?? ''} disabled className="pl-9 bg-gray-50 dark:bg-slate-900" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Teléfono', 'Phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={settings.phone}
                onChange={(event) => update({ phone: event.target.value })}
                className="pl-9"
                placeholder="+52 123 456 7890"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Rol', 'Role')}
            </label>
            <select
              value={settings.role}
              onChange={(event) => update({ role: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {translate(role.es, role.en)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 shadow border border-white/40 dark:border-slate-700/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <Bell className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {translate('Notificaciones', 'Notifications')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translate('Controla qué alertas recibes', 'Control which alerts you receive')}
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            {
              label: translate('Alertas de stock crítico', 'Critical stock alerts'),
              description: translate(
                'Recibe avisos cuando un producto baja del mínimo.',
                'Get notified when products drop below the threshold.'
              ),
              field: 'notifyStockCritical',
              value: settings.notifyStockCritical,
            },
            {
              label: translate('Productos próximos a vencer', 'Expiring products'),
              description: translate(
                'Mantente al tanto del vencimiento de productos sensibles.',
                'Stay ahead of sensitive product expirations.'
              ),
              field: 'notifyExpiring',
              value: settings.notifyExpiring,
            },
            {
              label: translate('Pedidos pendientes', 'Pending orders'),
              description: translate(
                'Recibe seguimiento cuando hay pedidos activos.',
                'Receive follow-ups whenever there are active orders.'
              ),
              field: 'notifyPendingOrders',
              value: settings.notifyPendingOrders,
            },
            {
              label: translate('Reportes diarios', 'Daily reports'),
              description: translate(
                'Resumen diario del inventario enviado al correo.',
                'Daily inventory summary delivered via email.'
              ),
              field: 'notifyDailyReports',
              value: settings.notifyDailyReports,
            },
          ].map((item) => (
            <div
              key={item.field}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <Switch
                checked={item.value}
                onCheckedChange={(checked) =>
                  update({ [item.field]: checked } as Partial<typeof settings>)
                }
                disabled={loading}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 shadow border border-white/40 dark:border-slate-700/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {translate('Seguridad', 'Security')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translate('Protege tu cuenta y sesiones', 'Protect your account and sessions')}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {translate('Autenticación de dos factores', 'Two-factor authentication')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {translate('Próximamente disponible para cuentas reforzadas.', 'Coming soon for hardened accounts.')}
              </p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {translate('Cambiar contraseña', 'Change password')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {translate('Enviamos un enlace de seguridad a tu correo registrado.', 'We send a secure link to your registered email.')}
              </p>
              {passwordMessage && (
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">{passwordMessage}</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handlePasswordReset} disabled={loading}>
              {translate('Enviar enlace', 'Send link')}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 shadow border border-white/40 dark:border-slate-700/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <Database className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {translate('Preferencias del sistema', 'System preferences')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translate('Configura formatos y localización', 'Configure formats and localisation')}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Moneda', 'Currency')}
            </label>
            <select
              value={settings.currency}
              onChange={(event) => update({ currency: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Zona horaria', 'Time zone')}
            </label>
            <select
              value={settings.timezone}
              onChange={(event) => update({ timezone: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {timezoneOptions.map((zone) => (
                <option value={zone} key={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {translate('Formato de fecha', 'Date format')}
            </label>
            <select
              value={settings.dateFormat}
              onChange={(event) => update({ dateFormat: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {dateFormatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {translate('Idioma', 'Language')}
            </label>
            <select
              value={settings.language}
              onChange={(event) => update({ language: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'es'
                    ? translate('Español', 'Spanish')
                    : translate('Inglés', 'English')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3"
      >
        <Button variant="outline" className="gap-2" onClick={() => refresh()} disabled={loading}>
          <RefreshCcw className="w-4 h-4" />
          {translate('Cancelar', 'Cancel')}
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl gap-2"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          {translate('Guardar Cambios', 'Save changes')}
        </Button>
      </motion.div>
    </div>
  );
}

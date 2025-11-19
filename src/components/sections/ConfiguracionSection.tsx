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

const roleOptions = ['Administrador', 'Farmacéutico', 'Almacén', 'Auditor'];
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

  const handleSave = async () => {
    await persist();
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setPasswordMessage(null);
      await resetPassword(user.email);
      setPasswordMessage('Te enviamos un enlace para restablecer tu contraseña.');
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'No se pudo enviar el enlace de seguridad.';
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
            Configuración
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
            Personaliza tu experiencia y ajusta las preferencias del sistema
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-sm"
          onClick={() => refresh()}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          Recargar datos
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Perfil de Usuario</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tu información personal sincronizada con Supabase Auth
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={settings.fullName}
                onChange={(event) => update({ fullName: event.target.value })}
                className="pl-9"
                placeholder="Nombre y apellidos"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input value={user?.email ?? ''} disabled className="pl-9 bg-gray-50 dark:bg-slate-900" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Teléfono</label>
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
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Rol</label>
            <select
              value={settings.role}
              onChange={(event) => update({ role: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Controla qué alertas recibes</p>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            {
              label: 'Alertas de stock crítico',
              description: 'Recibe avisos cuando un producto baja del mínimo.',
              field: 'notifyStockCritical',
              value: settings.notifyStockCritical,
            },
            {
              label: 'Productos próximos a vencer',
              description: 'Mantente al tanto del vencimiento de productos sensibles.',
              field: 'notifyExpiring',
              value: settings.notifyExpiring,
            },
            {
              label: 'Pedidos pendientes',
              description: 'Recibe seguimiento cuando hay pedidos activos.',
              field: 'notifyPendingOrders',
              value: settings.notifyPendingOrders,
            },
            {
              label: 'Reportes diarios',
              description: 'Resumen diario del inventario enviado al correo.',
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Seguridad</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Protege tu cuenta y sesiones</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Autenticación de dos factores
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Próximamente disponible para cuentas reforzadas.
              </p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Cambiar contraseña</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enviamos un enlace de seguridad a tu correo registrado.
              </p>
              {passwordMessage && (
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">{passwordMessage}</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handlePasswordReset} disabled={loading}>
              Enviar enlace
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Preferencias del sistema</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configura formatos y localización</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Moneda</label>
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
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Zona horaria</label>
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
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Formato de fecha</label>
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
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(event) => update({ language: event.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              disabled={loading}
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'es' ? 'Español' : 'Inglés'}
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
          Cancelar
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl gap-2"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          Guardar Cambios
        </Button>
      </motion.div>
    </div>
  );
}

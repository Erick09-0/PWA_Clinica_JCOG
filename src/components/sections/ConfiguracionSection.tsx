import { motion } from 'motion/react';
import { Settings, User, Bell, Shield, Database, Palette, Mail, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

const settingsSections = [
  {
    id: 'perfil',
    title: 'Perfil de Usuario',
    description: 'Administra tu información personal y preferencias',
    icon: User,
    color: 'from-blue-500 to-blue-600',
    settings: [
      { label: 'Nombre completo', value: 'Dr. García', type: 'text' },
      { label: 'Correo electrónico', value: 'dr.garcia@clinica.com', type: 'email' },
      { label: 'Rol', value: 'Administrador', type: 'select' },
      { label: 'Teléfono', value: '+1 234 567 890', type: 'tel' },
    ]
  },
  {
    id: 'notificaciones',
    title: 'Notificaciones',
    description: 'Configura cómo y cuándo recibir alertas',
    icon: Bell,
    color: 'from-cyan-500 to-blue-600',
    settings: [
      { label: 'Alertas de stock crítico', enabled: true, type: 'toggle' },
      { label: 'Productos próximos a vencer', enabled: true, type: 'toggle' },
      { label: 'Pedidos pendientes', enabled: false, type: 'toggle' },
      { label: 'Reportes diarios', enabled: true, type: 'toggle' },
    ]
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    description: 'Protege tu cuenta y datos sensibles',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    settings: [
      { label: 'Autenticación de dos factores', enabled: false, type: 'toggle' },
      { label: 'Cambiar contraseña', type: 'button', action: 'Cambiar' },
      { label: 'Sesiones activas', value: '2 dispositivos', type: 'info' },
      { label: 'Último acceso', value: 'Hoy a las 09:30', type: 'info' },
    ]
  },
  {
    id: 'sistema',
    title: 'Configuración del Sistema',
    description: 'Ajustes generales de la aplicación',
    icon: Database,
    color: 'from-blue-600 to-indigo-600',
    settings: [
      { label: 'Moneda', value: 'USD ($)', type: 'select' },
      { label: 'Zona horaria', value: 'GMT-5', type: 'select' },
      { label: 'Formato de fecha', value: 'DD/MM/YYYY', type: 'select' },
      { label: 'Idioma', value: 'Español', type: 'select' },
    ]
  },
];

export function ConfiguracionSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Configuración</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Personaliza tu experiencia y ajusta las preferencias del sistema</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Usuarios Activos', value: '5', icon: Users },
          { label: 'Sesiones Hoy', value: '12', icon: Shield },
          { label: 'Alertas Config.', value: '8', icon: Bell },
          { label: 'Última Backup', value: '2h', icon: Database },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 transition-colors" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors">{stat.value}</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-4 sm:space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${section.color} rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0`}>
                  <Icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">{section.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={settingIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + sectionIndex * 0.1 + settingIndex * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-slate-900 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <div className="font-medium text-gray-900 dark:text-white transition-colors text-sm sm:text-base">{setting.label}</div>
                      {setting.value && setting.type !== 'button' && (
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors truncate">{setting.value}</div>
                      )}
                    </div>
                    
                    <div>
                      {setting.type === 'toggle' && (
                        <Switch defaultChecked={setting.enabled} />
                      )}
                      {setting.type === 'button' && (
                        <Button variant="outline" size="sm" className="text-blue-600">
                          {setting.action}
                        </Button>
                      )}
                      {(setting.type === 'text' || setting.type === 'email' || setting.type === 'tel' || setting.type === 'select') && (
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Editar
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-end gap-4"
      >
        <Button variant="outline">
          Cancelar
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl">
          <Settings size={18} className="mr-2" />
          Guardar Cambios
        </Button>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';
import { HelpCircle, BookOpen, MessageCircle, Video, Mail, Phone, ExternalLink, Search } from 'lucide-react';
import { Button } from '../ui/button';

const faqs = [
  {
    question: '¿Cómo agregar un nuevo producto al inventario?',
    answer: 'Ve a la sección Inventario, haz clic en "Agregar Producto" y completa el formulario con la información requerida.',
    category: 'Inventario'
  },
  {
    question: '¿Cómo generar un reporte de productos críticos?',
    answer: 'Dirígete a la sección de Reportes y selecciona "Reporte de Productos Críticos", luego elige el formato de descarga.',
    category: 'Reportes'
  },
  {
    question: '¿Cómo configurar alertas de stock bajo?',
    answer: 'En Configuración > Notificaciones, activa la opción "Alertas de stock crítico" y define los umbrales mínimos.',
    category: 'Configuración'
  },
  {
    question: '¿Puedo exportar el inventario completo?',
    answer: 'Sí, en la sección Inventario encontrarás el botón "Exportar" que te permite descargar en formato Excel o PDF.',
    category: 'Inventario'
  },
  {
    question: '¿Cómo cambiar mi contraseña?',
    answer: 'Ve a Configuración > Seguridad y selecciona "Cambiar contraseña". Deberás ingresar tu contraseña actual y la nueva.',
    category: 'Seguridad'
  },
];

const resources = [
  {
    title: 'Guía de Inicio Rápido',
    description: 'Aprende lo básico en 5 minutos',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    type: 'PDF'
  },
  {
    title: 'Video Tutoriales',
    description: 'Tutoriales paso a paso',
    icon: Video,
    color: 'from-cyan-500 to-blue-600',
    type: 'Video'
  },
  {
    title: 'Documentación Completa',
    description: 'Guía detallada del sistema',
    icon: BookOpen,
    color: 'from-indigo-500 to-blue-600',
    type: 'Web'
  },
  {
    title: 'Soporte en Vivo',
    description: 'Chat con el equipo de soporte',
    icon: MessageCircle,
    color: 'from-blue-600 to-indigo-600',
    type: 'Chat'
  },
];

export function AyudaSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Centro de Ayuda</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Encuentra respuestas y recursos para aprovechar al máximo el sistema</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg text-white"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">¿En qué podemos ayudarte?</h3>
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-blue-200" size={18} />
          <input
            type="text"
            placeholder="Busca en nuestra base de conocimientos..."
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/20 backdrop-blur border-0 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
          />
        </div>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {[
          { icon: Mail, label: 'Email', value: 'soporte@medistock.com', color: 'from-blue-500 to-blue-600' },
          { icon: Phone, label: 'Teléfono', value: '+1 800 123 4567', color: 'from-cyan-500 to-blue-600' },
          { icon: MessageCircle, label: 'Chat en Vivo', value: 'Disponible 24/7', color: 'from-indigo-500 to-blue-600' },
        ].map((contact, index) => {
          const Icon = contact.icon;
          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 cursor-pointer transition-colors"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${contact.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                <Icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">{contact.label}</div>
              <div className="font-semibold text-gray-900 dark:text-white transition-colors text-sm sm:text-base">{contact.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors">Recursos y Tutoriales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${resource.color} rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0`}>
                    <Icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">{resource.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 transition-colors">{resource.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium transition-colors">
                      Explorar {resource.type}
                      <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">Preguntas Frecuentes</h2>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <HelpCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 transition-colors" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{faq.question}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">{faq.answer}</p>
                  <span className="inline-block px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-xs font-semibold rounded-lg">
                    {faq.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Support Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center"
      >
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl px-8 py-6 text-lg">
          <MessageCircle size={20} className="mr-2" />
          Contactar Soporte Técnico
        </Button>
      </motion.div>
    </div>
  );
}

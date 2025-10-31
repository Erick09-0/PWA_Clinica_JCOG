import { motion } from 'motion/react';
import { FileText, Download, Calendar, Filter, TrendingUp, Package, DollarSign, Clock } from 'lucide-react';
import { Button } from '../ui/button';

const reportTypes = [
  {
    id: 1,
    title: 'Reporte de Inventario Completo',
    description: 'Lista detallada de todos los productos con stock, precios y ubicaciones',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    lastGenerated: 'Hace 2 horas',
    format: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 2,
    title: 'Reporte de Movimientos',
    description: 'Historial de entradas y salidas de productos del inventario',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600',
    lastGenerated: 'Hace 1 día',
    format: ['PDF', 'Excel']
  },
  {
    id: 3,
    title: 'Reporte Financiero',
    description: 'Valorización del inventario y costos por categoría',
    icon: DollarSign,
    color: 'from-indigo-500 to-blue-600',
    lastGenerated: 'Hace 3 días',
    format: ['PDF', 'Excel']
  },
  {
    id: 4,
    title: 'Reporte de Productos Críticos',
    description: 'Productos con stock bajo o próximos a vencer',
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    lastGenerated: 'Hace 5 horas',
    format: ['PDF', 'Excel']
  },
];

const recentReports = [
  { name: 'Inventario_Completo_2024_10.pdf', date: '27 Oct 2024', size: '2.4 MB', type: 'PDF' },
  { name: 'Movimientos_Octubre_2024.xlsx', date: '26 Oct 2024', size: '856 KB', type: 'Excel' },
  { name: 'Reporte_Financiero_Q3.pdf', date: '25 Oct 2024', size: '1.8 MB', type: 'PDF' },
  { name: 'Productos_Criticos_Octubre.pdf', date: '24 Oct 2024', size: '524 KB', type: 'PDF' },
  { name: 'Inventario_Por_Categoria.xlsx', date: '23 Oct 2024', size: '1.2 MB', type: 'Excel' },
];

export function ReportesSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Centro de Reportes</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Genera y descarga reportes personalizados del inventario</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl mb-2">Generar Reporte Personalizado</h3>
            <p className="text-sm sm:text-base text-blue-100">Selecciona fechas, categorías y formato de exportación</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm">
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Seleccionar Período</span>
              <span className="sm:hidden">Período</span>
            </Button>
            <Button variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm">
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Configurar Filtros</span>
              <span className="sm:hidden">Filtros</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Report Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${report.color} rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0`}>
                  <Icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">{report.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">{report.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 transition-colors">
                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  Generado: {report.lastGenerated}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {report.format.map((format, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-2.5 sm:px-3 py-1.5 bg-gradient-to-r ${report.color} text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all`}
                    >
                      <Download size={12} className="sm:w-3.5 sm:h-3.5 inline mr-1" />
                      {format}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">Reportes Recientes</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">Últimos reportes generados y descargados</p>
          </div>
          <Button variant="outline" className="gap-2 text-sm w-full sm:w-auto">
            <FileText size={18} />
            Ver Todos
          </Button>
        </div>

        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border border-white/30 dark:border-slate-700/30 transition-all hover:bg-white/40 dark:hover:bg-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <FileText size={18} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white transition-colors text-sm sm:text-base truncate" title={report.name}>
                    {report.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors truncate">
                    {report.date} • {report.size}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex-shrink-0"
              >
                <Download size={18} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 transition-colors" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

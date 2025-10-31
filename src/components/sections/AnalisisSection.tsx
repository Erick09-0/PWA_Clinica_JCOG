import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, Package, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const monthlyData = [
  { month: 'Ene', ingresos: 4500, egresos: 3200, stock: 240 },
  { month: 'Feb', ingresos: 5200, egresos: 3800, stock: 235 },
  { month: 'Mar', ingresos: 4800, egresos: 4100, stock: 228 },
  { month: 'Abr', ingresos: 6100, egresos: 4500, stock: 245 },
  { month: 'May', ingresos: 7200, egresos: 5200, stock: 250 },
  { month: 'Jun', ingresos: 6800, egresos: 4800, stock: 247 },
];

const categoryData = [
  { name: 'Analgésicos', value: 45, color: '#3b82f6' },
  { name: 'Antibióticos', value: 30, color: '#06b6d4' },
  { name: 'Material Médico', value: 55, color: '#6366f1' },
  { name: 'Soluciones', value: 40, color: '#0ea5e9' },
  { name: 'Material Curación', value: 35, color: '#8b5cf6' },
  { name: 'Otros', value: 42, color: '#60a5fa' },
];

const topProducts = [
  { name: 'Paracetamol 500mg', sales: 450, trend: 12 },
  { name: 'Amoxicilina 500mg', sales: 380, trend: 8 },
  { name: 'Ibuprofeno 400mg', sales: 320, trend: -5 },
  { name: 'Guantes de Látex', sales: 290, trend: 15 },
  { name: 'Jeringuillas 5ml', sales: 250, trend: 10 },
];

export function AnalisisSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Análisis y Estadísticas</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Visualiza tendencias y patrones del inventario</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[
          { label: 'Valor Total Inventario', value: '$68,450', icon: DollarSign, change: '+8.2%', color: 'from-blue-500 to-blue-600' },
          { label: 'Productos Activos', value: '247', icon: Package, change: '+12', color: 'from-cyan-500 to-blue-600' },
          { label: 'Rotación Mensual', value: '173', icon: TrendingUp, change: '+5.3%', color: 'from-indigo-500 to-blue-600' },
          { label: 'Días Prom. Stock', value: '45', icon: Calendar, change: '-3 días', color: 'from-blue-600 to-indigo-600' },
        ].map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 bg-gradient-to-br ${kpi.color} rounded-xl sm:rounded-2xl shadow-lg`}>
                <kpi.icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent mb-1`}>
              {kpi.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">{kpi.label}</div>
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 transition-colors">{kpi.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
        >
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">Movimiento de Inventario</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">Ingresos vs Egresos (últimos 6 meses)</p>
          </div>
          <motion.div
            className="rounded-xl sm:rounded-2xl p-1 sm:p-4 transition-all duration-300"
          >
            <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-4 py-3 rounded-xl text-xs space-y-1 shadow-xl border border-blue-400"
                      >
                        <div className="font-semibold text-blue-300">{payload[0].payload.month}</div>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="font-medium">{entry.name}: {entry.value}</div>
                        ))}
                      </motion.div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Ingresos" animationBegin={0} animationDuration={800} />
              <Line type="monotone" dataKey="egresos" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Egresos" animationBegin={0} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Distribución por Categoría</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Stock actual por tipo de producto</p>
          </div>
          <motion.div
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
            }}
            className="rounded-2xl p-4 transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-950/20 dark:hover:to-purple-950/20"
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-4 py-3 rounded-xl text-xs space-y-1 shadow-xl border border-blue-400"
                        >
                          <div className="font-semibold text-blue-300">{payload[0].payload.name}</div>
                          <div className="font-medium">Cantidad: {payload[0].value} unidades</div>
                          <div className="text-blue-200 text-xs">
                            {((payload[0].value / categoryData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}% del total
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-lg border border-gray-100 dark:border-slate-700 transition-colors"
      >
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Productos Más Movidos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Top 5 productos con mayor rotación</p>
        </div>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white transition-colors">{product.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{product.sales} unidades despachadas</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {product.trend > 0 ? (
                  <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
                )}
                <span className={`font-semibold ${product.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors`}>
                  {product.trend > 0 ? '+' : ''}{product.trend}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

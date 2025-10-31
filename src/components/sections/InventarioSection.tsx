import { motion } from 'motion/react';
import { Search, Filter, Plus, Download, Package, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const products = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Analgésicos', stock: 150, minStock: 50, location: 'A-12', price: 2.50, expiry: '2025-06-15', status: 'good' },
  { id: 2, name: 'Amoxicilina 500mg', category: 'Antibióticos', stock: 80, minStock: 60, location: 'B-08', price: 5.20, expiry: '2025-03-20', status: 'good' },
  { id: 3, name: 'Guantes de Látex (Caja)', category: 'Material Médico', stock: 8, minStock: 100, location: 'C-05', price: 15.00, expiry: '2026-12-31', status: 'critical' },
  { id: 4, name: 'Ibuprofeno 400mg', category: 'Analgésicos', stock: 120, minStock: 40, location: 'A-15', price: 3.00, expiry: '2025-08-10', status: 'good' },
  { id: 5, name: 'Vendas Elásticas 10cm', category: 'Material de Curación', stock: 22, minStock: 30, location: 'C-12', price: 4.50, expiry: '2027-01-15', status: 'low' },
  { id: 6, name: 'Suero Fisiológico 500ml', category: 'Soluciones', stock: 35, minStock: 80, location: 'D-02', price: 3.80, expiry: '2024-12-30', status: 'low' },
  { id: 7, name: 'Jeringuillas 5ml (Pack)', category: 'Material Médico', stock: 200, minStock: 150, location: 'C-08', price: 8.00, expiry: '2026-05-20', status: 'good' },
  { id: 8, name: 'Alcohol 70% 1L', category: 'Antisépticos', stock: 45, minStock: 20, location: 'B-15', price: 6.50, expiry: '2025-11-30', status: 'good' },
];

const statusConfig = {
  good: { label: 'Óptimo', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  low: { label: 'Bajo', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  critical: { label: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
};

export function InventarioSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Gestión de Inventario</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Administra todos los productos y materiales médicos</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg text-sm sm:text-base">
            <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
            Agregar Producto
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Productos', value: '247', color: 'from-blue-500 to-blue-600' },
          { label: 'Stock Óptimo', value: '221', color: 'from-green-500 to-green-600' },
          { label: 'Stock Bajo', value: '15', color: 'from-amber-500 to-orange-500' },
          { label: 'Stock Crítico', value: '11', color: 'from-red-500 to-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">{stat.label}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o ubicación..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 overflow-hidden transition-colors"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {products.map((product, index) => {
                const status = statusConfig[product.status as keyof typeof statusConfig];
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${status.bgColor} dark:bg-opacity-20 rounded-xl flex items-center justify-center`}>
                          <Package size={18} className={status.textColor} />
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white transition-colors">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{product.stock} uds</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Mín: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">{product.location}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white transition-colors">${product.price}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${status.color} text-white`}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Eye size={16} className="text-blue-600 dark:text-blue-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

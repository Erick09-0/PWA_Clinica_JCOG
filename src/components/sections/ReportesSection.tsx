import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  Loader2,
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../contexts/ToastContext';
import {
  getInventoryReportData,
  getMovementReportData,
  getFinancialReportData,
  getCriticalProductsReportData,
  type ReportFilters,
} from '../../services/reportsService';
import { getCategories } from '../../services/inventoryService';

type ReportFormat = 'PDF' | 'Excel' | 'CSV';

interface ReportTableData {
  title: string;
  fileName: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string | number>[];
}

interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  formats: ReportFormat[];
  generator: (filters: ReportFilters) => Promise<ReportTableData>;
  defaultLastGenerated: string;
}

interface RecentReportEntry {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  reportId?: string;
  filters?: ReportFilters;
  format?: ReportFormat;
}

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return blob.size;
};

const exportToCSV = async (table: ReportTableData, filename: string) => {
  const escapeValue = (value: string | number) => {
    const str = String(value ?? '');
    if (/["\n,]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = table.columns.map((col) => escapeValue(col.label)).join(',');
  const rows = table.rows.map((row) =>
    table.columns.map((col) => escapeValue(row[col.key] ?? '')).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const size = downloadBlob(blob, `${filename}.csv`);
  return size;
};

const exportToExcel = async (table: ReportTableData, filename: string) => {
  const worksheetData = table.rows.map((row) => {
    const item: Record<string, string | number> = {};
    table.columns.forEach((col) => {
      item[col.label] = row[col.key] ?? '';
    });
    return item;
  });
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const size = downloadBlob(blob, `${filename}.xlsx`);
  return size;
};

const exportToPDF = async (table: ReportTableData, filename: string) => {
  const orientation = table.columns.length > 5 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginTop = 20;
  const usableWidth = pageWidth - marginLeft * 2;
  const columnWidth = usableWidth / table.columns.length;

  doc.setFontSize(12);
  doc.text(table.title, marginLeft, marginTop - 6);
  doc.setFontSize(9);

  let y = marginTop;
  table.columns.forEach((col, idx) => {
    doc.text(col.label, marginLeft + idx * columnWidth, y);
  });
  y += 6;

  table.rows.forEach((row) => {
    let maxHeight = 0;
    table.columns.forEach((col, idx) => {
      const cellText = String(row[col.key] ?? '');
      const text = doc.splitTextToSize(cellText, columnWidth - 2);
      text.forEach((line, lineIndex) => {
        const lineY = y + lineIndex * 4;
        if (lineY > pageHeight - 20) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(line, marginLeft + idx * columnWidth, lineY);
      });
      maxHeight = Math.max(maxHeight, text.length * 4);
    });
    y += maxHeight + 2;
    if (y > pageHeight - 20) {
      doc.addPage();
      y = marginTop;
    }
  });

  const blob = doc.output('blob');
  const size = downloadBlob(blob, `${filename}.pdf`);
  return size;
};

const reportDefinitions: ReportDefinition[] = [
  {
    id: 'inventory',
    title: 'Reporte de Inventario Completo',
    description: 'Lista detallada de productos con stock, precios y ubicaciones',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    formats: ['PDF', 'Excel', 'CSV'],
    defaultLastGenerated: 'Nunca',
    generator: async (filters) => {
      const products = await getInventoryReportData(filters);
      return {
        title: 'Inventario completo',
        fileName: `inventario_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'name', label: 'Producto' },
          { key: 'category', label: 'Categoría' },
          { key: 'stock', label: 'Stock' },
          { key: 'minStock', label: 'Stock mínimo' },
          { key: 'location', label: 'Ubicación' },
          { key: 'price', label: 'Precio' },
          { key: 'value', label: 'Valor' },
        ],
        rows: products.map((product) => ({
          name: product.name,
          category: product.category,
          stock: product.stock,
          minStock: product.minStock,
          location: product.location,
          price: product.price.toFixed(2),
          value: product.value.toFixed(2),
        })),
      };
    },
  },
  {
    id: 'movements',
    title: 'Reporte de Movimientos',
    description: 'Historial de entradas y salidas del inventario',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600',
    formats: ['PDF', 'Excel'],
    defaultLastGenerated: 'Nunca',
    generator: async (filters) => {
      const movements = await getMovementReportData(filters);
      return {
        title: 'Movimientos de inventario',
        fileName: `movimientos_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'created_at', label: 'Fecha' },
          { key: 'movement_type', label: 'Tipo' },
          { key: 'product_name', label: 'Producto' },
          { key: 'category', label: 'Categoría' },
          { key: 'quantity', label: 'Cantidad' },
          { key: 'reason', label: 'Motivo' },
        ],
        rows: movements.map((movement) => ({
          created_at: formatDate(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', {
            locale: es,
          }),
          movement_type: movement.movement_type,
          product_name: movement.product_name,
          category: movement.category,
          quantity: movement.quantity,
          reason: movement.reason,
        })),
      };
    },
  },
  {
    id: 'financial',
    title: 'Reporte Financiero',
    description: 'Valorización del inventario y costos por categoría',
    icon: DollarSign,
    color: 'from-indigo-500 to-blue-600',
    formats: ['PDF', 'Excel'],
    defaultLastGenerated: 'Nunca',
    generator: async (filters) => {
      const { totalValue, rows } = await getFinancialReportData(filters);
      return {
        title: 'Resumen financiero del inventario',
        fileName: `financiero_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'category', label: 'Categoría' },
          { key: 'totalStock', label: 'Stock total' },
          { key: 'totalValue', label: 'Valor total' },
          { key: 'contribution', label: '% Contribución' },
        ],
        rows: rows.map((row) => ({
          category: row.category,
          totalStock: row.totalStock,
          totalValue: row.totalValue.toFixed(2),
          contribution: `${row.contribution}%`,
        })),
      };
    },
  },
  {
    id: 'critical',
    title: 'Reporte de Productos Críticos',
    description: 'Productos con stock bajo o próximos a vencer',
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    formats: ['PDF', 'Excel'],
    defaultLastGenerated: 'Nunca',
    generator: async (filters) => {
      const products = await getCriticalProductsReportData(filters);
      return {
        title: 'Productos críticos y próximos a vencer',
        fileName: `criticos_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'name', label: 'Producto' },
          { key: 'category', label: 'Categoría' },
          { key: 'stock', label: 'Stock' },
          { key: 'minStock', label: 'Stock mínimo' },
          { key: 'expiry_date', label: 'Caducidad' },
        ],
        rows: products.map((product) => ({
          name: product.name,
          category: product.category,
          stock: product.stock,
          minStock: product.min_stock,
          expiry_date: product.expiry_date
            ? formatDate(new Date(product.expiry_date), 'dd/MM/yyyy')
            : 'N/D',
        })),
      };
    },
  },
];

const staticRecentReports: RecentReportEntry[] = [
  { id: '1', name: 'Inventario_Completo_2024_10.pdf', date: '27 Oct 2024', size: '2.4 MB', type: 'PDF' },
  { id: '2', name: 'Movimientos_Octubre_2024.xlsx', date: '26 Oct 2024', size: '856 KB', type: 'Excel' },
  { id: '3', name: 'Reporte_Financiero_Q3.pdf', date: '25 Oct 2024', size: '1.8 MB', type: 'PDF' },
  { id: '4', name: 'Productos_Criticos_Octubre.pdf', date: '24 Oct 2024', size: '524 KB', type: 'PDF' },
  { id: '5', name: 'Inventario_Por_Categoria.xlsx', date: '23 Oct 2024', size: '1.2 MB', type: 'Excel' },
];

export function ReportesSection() {
  const { success, error: showError, warning } = useToast();
  const [filters, setFilters] = useState<ReportFilters>({ from: '', to: '', category: 'all' });
  const [categories, setCategories] = useState<string[]>(['all']);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [lastGenerated, setLastGenerated] = useState<Record<string, string>>(
    reportDefinitions.reduce<Record<string, string>>((acc, report) => {
      acc[report.id] = report.defaultLastGenerated;
      return acc;
    }, {})
  );
  const [recentReports, setRecentReports] =
    useState<RecentReportEntry[]>(staticRecentReports);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(['all', ...data]);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const activeFilters = useMemo(
    () => ({
      from: filters.from || undefined,
      to: filters.to || undefined,
      category: filters.category && filters.category !== 'all' ? filters.category : undefined,
    }),
    [filters]
  );

  const exportHandlers: Record<ReportFormat, (data: ReportTableData, filename: string) => Promise<number>> = {
    PDF: exportToPDF,
    Excel: exportToExcel,
    CSV: exportToCSV,
  };

  const generateAndExport = async (
    report: ReportDefinition,
    format: ReportFormat,
    customFilters?: ReportFilters,
    skipHistory?: boolean
  ) => {
    const key = `${report.id}-${format}`;
    try {
      setGenerating((prev) => ({ ...prev, [key]: true }));
      const filtersToUse = customFilters ?? activeFilters;
      const table = await report.generator(filtersToUse);

      if (!table.rows.length) {
        warning('No se encontraron datos para los filtros seleccionados.');
        return;
      }

      const fileName = table.fileName || `${report.id}_${format.toLowerCase()}`;
      const size = await exportHandlers[format](table, fileName);
      const timestamp = formatDate(new Date(), "dd MMM yyyy HH:mm", { locale: es });

      setLastGenerated((prev) => ({ ...prev, [report.id]: timestamp }));

      if (!skipHistory && size) {
        const newEntry: RecentReportEntry = {
          id: Math.random().toString(36).slice(2, 9),
          name: `${fileName}.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`,
          date: formatDate(new Date(), "dd MMM yyyy", { locale: es }),
          size: formatBytes(size),
          type: format,
          reportId: report.id,
          filters: { ...filtersToUse },
          format,
        };
        setRecentReports((prev) => [newEntry, ...prev].slice(0, 5));
      }

      success('Reporte generado correctamente.');
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'No se pudo generar el reporte.';
      showError(message);
      console.error(err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRecentDownload = async (entry: RecentReportEntry) => {
    if (!entry.reportId || !entry.format) {
      warning('Este registro es de ejemplo y no está disponible para descargar.');
      return;
    }
    const definition = reportDefinitions.find((item) => item.id === entry.reportId);
    if (!definition) {
      warning('No se encontró la definición del reporte.');
      return;
    }
    await generateAndExport(definition, entry.format, entry.filters, true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Centro de Reportes
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Genera y descarga reportes personalizados del inventario
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg text-white"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2">
                Generar reporte personalizado
              </h3>
              <p className="text-sm sm:text-base text-blue-100">
                Define el rango de fechas, categoría y formato de exportación.
              </p>
            </div>
            <Button
              variant="secondary"
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm"
              onClick={() => setFilters({ from: '', to: '', category: 'all' })}
            >
              <Filter size={16} />
              Limpiar filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              Desde
              <Input
                type="date"
                value={filters.from || ''}
                onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
                className="bg-white/90 text-blue-900"
              />
            </label>
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              Hasta
              <Input
                type="date"
                value={filters.to || ''}
                onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
                className="bg-white/90 text-blue-900"
              />
            </label>
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              Categoría
              <select
                value={filters.category || 'all'}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, category: event.target.value }))
                }
                className="bg-white/90 text-blue-900 rounded-xl px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category === 'all' ? 'Todas' : category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {reportDefinitions.map((report, index) => {
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Último generado: {lastGenerated[report.id]}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {report.formats.map((format) => {
                    const key = `${report.id}-${format}`;
                    return (
                      <motion.button
                        key={format}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateAndExport(report, format)}
                        disabled={generating[key]}
                        className={`px-2.5 sm:px-3 py-1.5 bg-gradient-to-r ${report.color} text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1`}
                      >
                        {generating[key] ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Download size={12} />
                        )}
                        {format}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">
              Reportes recientes
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Últimos reportes generados y descargados
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
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
                onClick={() => handleRecentDownload(report)}
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

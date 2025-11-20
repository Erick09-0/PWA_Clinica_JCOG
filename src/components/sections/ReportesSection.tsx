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
import type { Locale } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getInventoryReportData,
  getMovementReportData,
  getFinancialReportData,
  getCriticalProductsReportData,
  type ReportFilters,
} from '../../services/reportsService';
import { getCategories } from '../../services/inventoryService';

type ReportFormat = 'PDF' | 'Excel' | 'CSV';

type TranslateFn = (esText: string, enText: string) => string;

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
  isSample?: boolean;
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

const createReportDefinitions = (translate: TranslateFn, locale: Locale): ReportDefinition[] => [
  {
    id: 'inventory',
    title: translate('Reporte de Inventario Completo', 'Complete Inventory Report'),
    description: translate(
      'Lista detallada de productos con stock, precios y ubicaciones',
      'Detailed list of products with stock, pricing, and locations'
    ),
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    formats: ['PDF', 'Excel', 'CSV'],
    generator: async (filters) => {
      const products = await getInventoryReportData(filters);
      return {
        title: translate('Inventario completo', 'Complete inventory'),
        fileName: `${translate('inventario', 'inventory')}_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'name', label: translate('Producto', 'Product') },
          { key: 'category', label: translate('Categor\u00eda', 'Category') },
          { key: 'stock', label: translate('Stock', 'Stock') },
          { key: 'minStock', label: translate('Stock m\u00ednimo', 'Minimum stock') },
          { key: 'location', label: translate('Ubicaci\u00f3n', 'Location') },
          { key: 'price', label: translate('Precio', 'Price') },
          { key: 'value', label: translate('Valor', 'Value') },
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
    title: translate('Reporte de Movimientos', 'Movements Report'),
    description: translate('Historial de entradas y salidas del inventario', 'Inventory inflow/outflow history'),
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600',
    formats: ['PDF', 'Excel'],
    generator: async (filters) => {
      const movements = await getMovementReportData(filters);
      return {
        title: translate('Movimientos de inventario', 'Inventory movements'),
        fileName: `${translate('movimientos', 'movements')}_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'created_at', label: translate('Fecha', 'Date') },
          { key: 'movement_type', label: translate('Tipo', 'Type') },
          { key: 'product_name', label: translate('Producto', 'Product') },
          { key: 'category', label: translate('Categor\u00eda', 'Category') },
          { key: 'quantity', label: translate('Cantidad', 'Quantity') },
          { key: 'reason', label: translate('Motivo', 'Reason') },
        ],
        rows: movements.map((movement) => ({
          created_at: formatDate(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', {
            locale,
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
    title: translate('Reporte Financiero', 'Financial Report'),
    description: translate(
      'Valorizaci\u00f3n del inventario y costos por categor\u00eda',
      'Inventory valuation and costs by category'
    ),
    icon: DollarSign,
    color: 'from-indigo-500 to-blue-600',
    formats: ['PDF', 'Excel'],
    generator: async (filters) => {
      const { rows } = await getFinancialReportData(filters);
      return {
        title: translate('Resumen financiero del inventario', 'Inventory financial summary'),
        fileName: `${translate('financiero', 'financial')}_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'category', label: translate('Categor\u00eda', 'Category') },
          { key: 'totalStock', label: translate('Stock total', 'Total stock') },
          { key: 'totalValue', label: translate('Valor total', 'Total value') },
          { key: 'contribution', label: translate('% Contribuci\u00f3n', '% Contribution') },
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
    title: translate('Reporte de Productos Cr\u00edticos', 'Critical Products Report'),
    description: translate('Productos con stock bajo o pr\u00f3ximos a vencer', 'Products with low stock or near expiration'),
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    formats: ['PDF', 'Excel'],
    generator: async (filters) => {
      const products = await getCriticalProductsReportData(filters);
      const noDataLabel = translate('N/D', 'N/A');
      return {
        title: translate('Productos cr\u00edticos y pr\u00f3ximos a vencer', 'Critical and near-expiry products'),
        fileName: `${translate('cr\u00edticos', 'critical')}_${formatDate(new Date(), 'yyyyMMdd_HHmm')}`,
        columns: [
          { key: 'name', label: translate('Producto', 'Product') },
          { key: 'category', label: translate('Categor\u00eda', 'Category') },
          { key: 'stock', label: translate('Stock', 'Stock') },
          { key: 'minStock', label: translate('Stock m\u00ednimo', 'Minimum stock') },
          { key: 'expiry_date', label: translate('Caducidad', 'Expiration') },
        ],
        rows: products.map((product) => ({
          name: product.name,
          category: product.category,
          stock: product.stock,
          minStock: product.min_stock,
          expiry_date: product.expiry_date
            ? formatDate(new Date(product.expiry_date), 'dd/MM/yyyy')
            : noDataLabel,
        })),
      };
    },
  },
];

const createStaticRecentReports = (translate: TranslateFn, locale: Locale): RecentReportEntry[] => {
  const samples = [
    {
      id: 'sample-1',
      name: translate('Inventario_Completo_2024_10.pdf', 'Complete_Inventory_2024_10.pdf'),
      date: new Date(2024, 9, 27),
      size: '2.4 MB',
      type: 'PDF',
    },
    {
      id: 'sample-2',
      name: translate('Movimientos_Octubre_2024.xlsx', 'Movements_October_2024.xlsx'),
      date: new Date(2024, 9, 26),
      size: '856 KB',
      type: 'Excel',
    },
    {
      id: 'sample-3',
      name: translate('Reporte_Financiero_Q3.pdf', 'Financial_Report_Q3.pdf'),
      date: new Date(2024, 9, 25),
      size: '1.8 MB',
      type: 'PDF',
    },
    {
      id: 'sample-4',
      name: translate('Productos_Criticos_Octubre.pdf', 'Critical_Products_October.pdf'),
      date: new Date(2024, 9, 24),
      size: '524 KB',
      type: 'PDF',
    },
    {
      id: 'sample-5',
      name: translate('Inventario_Por_Categoria.xlsx', 'Inventory_By_Category.xlsx'),
      date: new Date(2024, 9, 23),
      size: '1.2 MB',
      type: 'Excel',
    },
  ];

  return samples.map((sample) => ({
    ...sample,
    date: formatDate(sample.date, 'dd MMM yyyy', { locale }),
    isSample: true,
  }));
};

export function ReportesSection() {
  const { success, error: showError, warning } = useToast();
  const { translate, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : es;
  const reportDefinitions = useMemo(
    () => createReportDefinitions(translate, dateLocale),
    [translate, dateLocale]
  );
  const [filters, setFilters] = useState<ReportFilters>({ from: '', to: '', category: 'all' });
  const [categories, setCategories] = useState<string[]>(['all']);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [lastGenerated, setLastGenerated] = useState<Record<string, string | null>>(() =>
    reportDefinitions.reduce<Record<string, string | null>>((acc, report) => {
      acc[report.id] = null;
      return acc;
    }, {})
  );
  const [recentReports, setRecentReports] = useState<RecentReportEntry[]>(() =>
    createStaticRecentReports(translate, dateLocale)
  );

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

  useEffect(() => {
    setLastGenerated((prev) => {
      const updated: Record<string, string | null> = {};
      reportDefinitions.forEach((report) => {
        updated[report.id] = prev[report.id] ?? null;
      });
      return updated;
    });
  }, [reportDefinitions]);

  useEffect(() => {
    setRecentReports((prev) => {
      const generated = prev.filter((entry) => !entry.isSample);
      const limited = generated.slice(0, 5);
      const samples = createStaticRecentReports(translate, dateLocale);
      const needed = Math.max(0, 5 - limited.length);
      return [...limited, ...samples.slice(0, needed)];
    });
  }, [translate, dateLocale]);

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
        warning(
          translate(
            'No se encontraron datos para los filtros seleccionados.',
            'No data found for the selected filters.'
          )
        );
        return;
      }

      const fileName = table.fileName || `${report.id}_${format.toLowerCase()}`;
      const size = await exportHandlers[format](table, fileName);
      const timestamp = new Date().toISOString();
      setLastGenerated((prev) => ({ ...prev, [report.id]: timestamp }));

      if (!skipHistory && size) {
        const newEntry: RecentReportEntry = {
          id: Math.random().toString(36).slice(2, 9),
          name: `${fileName}.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`,
          date: formatDate(new Date(), 'dd MMM yyyy', { locale: dateLocale }),
          size: formatBytes(size),
          type: format,
          reportId: report.id,
          filters: { ...filtersToUse },
          format,
          isSample: false,
        };
        setRecentReports((prev) => [newEntry, ...prev].slice(0, 5));
      }

      success(translate('Reporte generado correctamente.', 'Report generated successfully.'));
    } catch (err: any) {
      const message =
        err instanceof Error
          ? err.message
          : translate('No se pudo generar el reporte.', 'Unable to generate the report.');
      showError(message);
      console.error(err);
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRecentDownload = async (entry: RecentReportEntry) => {
    if (!entry.reportId || !entry.format) {
      warning(
        translate(
          'Este registro es de ejemplo y no est\u00e1 disponible para descargar.',
          'This record is a sample and is not available for download.'
        )
      );
      return;
    }
    const definition = reportDefinitions.find((item) => item.id === entry.reportId);
    if (!definition) {
      warning(
        translate('No se encontr\u00f3 la definici\u00f3n del reporte.', 'Report definition was not found.')
      );
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
          {translate('Centro de Reportes', 'Reports Center')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {translate('Genera y descarga reportes personalizados del inventario', 'Generate and download custom inventory reports')}
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
                {translate('Generar reporte personalizado', 'Generate a custom report')}
              </h3>
              <p className="text-sm sm:text-base text-blue-100">
                {translate('Define el rango de fechas, categor\u00eda y formato de exportaci\u00f3n.', 'Set the date range, category, and export format.')}
              </p>
            </div>
            <Button
              variant="secondary"
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm"
              onClick={() => setFilters({ from: '', to: '', category: 'all' })}
            >
              <Filter size={16} />
              {translate('Limpiar filtros', 'Clear filters')}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              {translate('Desde', 'From')}
              <Input
                type="date"
                value={filters.from || ''}
                onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
                className="bg-white/90 text-blue-900"
              />
            </label>
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              {translate('Hasta', 'To')}
              <Input
                type="date"
                value={filters.to || ''}
                onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
                className="bg-white/90 text-blue-900"
              />
            </label>
            <label className="text-xs font-medium text-blue-100 flex flex-col gap-1">
              {translate('Categor\u00eda', 'Category')}
              <select
                value={filters.category || 'all'}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, category: event.target.value }))
                }
                className="bg-white/90 text-blue-900 rounded-xl px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category === 'all' ? translate('Todas', 'All') : category}
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
          const lastGeneratedValue = lastGenerated[report.id];
          const lastGeneratedLabel = lastGeneratedValue
            ? formatDate(new Date(lastGeneratedValue), 'dd MMM yyyy HH:mm', { locale: dateLocale })
            : translate('Nunca', 'Never');
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
                  {translate('Último generado', 'Last generated')}: {lastGeneratedLabel}
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
              {translate('Reportes recientes', 'Recent reports')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {translate(
                'Últimos reportes generados y descargados',
                'Latest generated and downloaded reports'
              )}
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
                    {report.date} ? {report.size}
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

import React, { useState, useRef } from "react";
import {
  Tag,
  Search,
  Printer,
  CheckCircle2,
  Package,
  Filter,
  Download,
} from "lucide-react";
import { useOrders, MainOrder } from "../../context/OrderContext";
import { ThermalLabel } from "../../components/ThermalLabel";
import { useReactToPrint } from "react-to-print";

export default function Stickers() {
  const { orders } = useOrders();
  const warehouseOrders = orders.filter(
    (o) =>
      o.status === "main_warehouse" ||
      o.status === "branch_warehouse" ||
      o.status === "processing",
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Thermal_Labels",
    pageStyle: `
      @page { size: 100mm 150mm; margin: 0; }
      @media print {
        body { margin: 0; padding: 0; background: white; }
        .page-break { page-break-after: always; }
      }
    `,
  });

  const filteredOrders = warehouseOrders.filter(
    (order) =>
      order.trackingNumber.includes(searchTerm) ||
      order.customerName.includes(searchTerm) ||
      order.customerPhone.includes(searchTerm) ||
      order.merchantName.includes(searchTerm),
  );

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((orderId) => orderId !== id)
        : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const selectedOrdersData = warehouseOrders.filter((o) =>
    selectedOrders.includes(o.id),
  );

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-right">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            طباعة الاستيكرات الحرارية
          </h1>
          <div className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2 justify-end">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold border border-blue-200">
              في المخزن
            </span>
            طباعة ملصقات الشحن (100x150mm) للطلبات المتوفرة في المخزن
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
          >
            {selectedOrders.length === filteredOrders.length &&
            filteredOrders.length > 0
              ? "إلغاء التحديد"
              : "تحديد الكل"}
          </button>
          <button
            onClick={() => setIsPrintPreview(true)}
            disabled={selectedOrders.length === 0}
            className="bg-slate-800 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-slate-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Printer className="w-5 h-5" />
            معاينة الطباعة ({selectedOrders.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pr-11 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand focus:border-brand shadow-sm transition-all"
            placeholder="بحث برقم التتبع، هاتف العميل، المتجر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir="rtl"
          />
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Filter className="w-5 h-5" />
          تصفية متقدمة
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={selectAll}
                    className="w-5 h-5 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm">
                  رقم التتبع
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm">
                  التاريخ
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm">المتجر</th>
                <th className="p-4 font-bold text-slate-600 text-sm">
                  هاتف العميل
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm">
                  المحافظة
                </th>
                <th className="p-4 font-bold text-slate-600 text-sm text-center">
                  طباعة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-slate-500 font-medium"
                  >
                    {warehouseOrders.length === 0
                      ? "لا توجد طلبات في المخزن حالياً."
                      : "لم يتم العثور على نتائج للبحث."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-slate-50/50 transition-colors ${selectedOrders.includes(order.id) ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-5 h-5 rounded border-slate-300 text-brand focus:ring-brand"
                      />
                    </td>
                    <td
                      className="p-4 font-en font-bold text-slate-800 text-sm"
                      dir="ltr"
                    >
                      {order.trackingNumber}
                    </td>
                    <td className="p-4 font-en text-slate-600 text-sm">
                      {new Date(order.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">
                        {order.merchantName}
                      </div>
                    </td>
                    <td
                      className="p-4 font-en text-slate-600 text-sm"
                      dir="ltr"
                    >
                      {order.customerPhone}
                    </td>
                    <td className="p-4 font-bold text-slate-700 text-sm">
                      {order.province}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrders([order.id]);
                          setIsPrintPreview(true);
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center justify-center mx-auto"
                        title="طباعة"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Preview Modal */}
      {isPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-slate-100 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-b border-slate-200 gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto order-2 sm:order-1">
                <button
                  onClick={() => setIsPrintPreview(false)}
                  className="text-slate-500 hover:text-slate-800 font-bold px-2 sm:px-4 py-2 text-sm sm:text-base"
                >
                  إلغاء الأمر
                </button>
                
                {/* On mobile, show the print button here as well, right aligned */}
                <button
                  onClick={() => handlePrint()}
                  className="sm:hidden bg-brand text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-brand/90 transition-colors text-sm shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  طباعة ({selectedOrders.length})
                </button>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-slate-800 order-1 sm:order-2 w-full sm:w-auto text-center">
                معاينة الاستيكرات الحرارية
              </h2>
              
              <div className="hidden sm:flex gap-2 order-3">
                <button
                  onClick={() => handlePrint()}
                  className="bg-brand text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-brand/90 transition-colors whitespace-nowrap"
                >
                  <Printer className="w-5 h-5" />
                  طباعة الآن ({selectedOrders.length} ملصقات)
                </button>
              </div>
            </div>

            {/* Modal Body / Preview Area */}
            <div className="flex-1 overflow-auto p-8 flex flex-col items-center gap-8 print-preview-area bg-slate-200">
              <div className="text-slate-500 font-bold text-sm mb-2 text-center">
                حجم الملصق: 100mm × 150mm <br />
                سيتم طباعة كل ملصق في صفحة مستقلة
              </div>

              {/* Hidden printable content - rendered out of sight but print takes this ref */}
              <div className="hidden">
                <div ref={printRef} className="print-content-wrapper">
                  {selectedOrdersData.map((order, index) => (
                    <div
                      key={order.id}
                      className="page-break"
                      style={{ pageBreakAfter: "always" }}
                    >
                      <ThermalLabel order={order} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Preview for UI */}
              {selectedOrdersData.map((order) => (
                <div
                  key={`preview-${order.id}`}
                  className="bg-white shadow-xl scale-90 md:scale-100 origin-top"
                  style={{ width: "100mm", height: "150mm", flexShrink: 0 }}
                >
                  <ThermalLabel order={order} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, FileDown, Printer, Trash2, Search, 
  Star, Warehouse, Truck, Building2, 
  ChevronLeft, MessageCircle, X, CheckSquare, Square,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders, MainOrder } from '../../context/OrderContext';

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { orders, addOrder, deleteOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('جديد');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New order state
  const [newOrder, setNewOrder] = useState({
    pieces: 1, trackingNumber: '', customerPhone: '', customerName: '', address: '', province: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs configuration mappings to OrderStatus
  const tabs = [
    { name: 'جديد', icon: Star, status: 'merchant_pending' },
    { name: 'في المخزن', icon: Warehouse, status: 'main_warehouse' },
    { name: 'قيد التوصيل', icon: Truck, status: 'driver_assigned' },
    { name: 'تم التسليم', icon: Building2, status: 'delivered' },
  ];

  // Filter and Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === 'جديد' ? order.status === 'merchant_pending' : order.status === tabs.find(t => t.name === activeTab)?.status;
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.length} طلب؟`)) {
      selectedIds.forEach(id => deleteOrder(id));
      setSelectedIds([]);
    }
  };

  const handlePrint = () => {
    if (selectedIds.length === 0) {
      alert("يرجى تحديد طلبات للطباعة أولاً");
      return;
    }
    window.print();
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      logout();
      navigate('/');
    }
  };
  
  const handleCreateOrder = () => {
    if(!newOrder.customerName || !newOrder.customerPhone || !newOrder.province) {
       alert("الرجاء ملء كافة الحقول المطلوبة (الاسم، الهاتف، المحافظة)");
       return;
    }
    const order: MainOrder = {
       id: `ORD-${1000 + orders.length + 1}`,
       trackingNumber: newOrder.trackingNumber || `SHP-${Math.floor(Math.random() * 100000)}`,
       merchantName: 'التاجر الحالي',
       customerName: newOrder.customerName,
       customerPhone: newOrder.customerPhone,
       address: newOrder.address,
       province: newOrder.province,
       amount: 25000,
       deliveryFee: 5000,
       totalAmount: 30000,
       date: new Date().toISOString().split('T')[0],
       pieces: newOrder.pieces,
       status: 'merchant_pending'
    };
    addOrder(order);
    setIsAddModalOpen(false);
    setNewOrder({ pieces: 1, trackingNumber: '', customerPhone: '', customerName: '', address: '', province: '' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] -m-4 lg:-m-8 pb-10 overflow-x-hidden text-right" dir="rtl">
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" />

      <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Action Bar */}
        <div className="flex justify-start mb-2">
          <Link to="/merchant" className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-[#0F3B73]/20 w-fit">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Title Section */}
        <div className="relative pr-6">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0F3B73] rounded-full"></div>
          <p className="text-[#0F3B73] font-bold text-sm mb-1 uppercase tracking-wider">إدارة العمليات</p>
          <h1 className="text-4xl font-black text-[#0F3B73] mb-2 tracking-tight">طلباتي</h1>
          <p className="text-slate-500 font-medium tracking-wide">متابعة وتحديث حالة الشحنات في النظام</p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all shadow-lg shadow-[#0F3B73]/20"
          >
            <Plus className="w-5 h-5 text-white stroke-[3px]" />
            <span>طلب جديد</span>
          </button>
          
          <button 
            onClick={handleExcelImport}
            className="bg-[#0F3B73] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all"
          >
            <FileDown className="w-5 h-5" />
            <span>إدراج إكسل</span>
          </button>

          <button 
            onClick={handlePrint}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة الملصقات</span>
          </button>

          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="bg-[#ef4444] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all animate-in fade-in zoom-in-95 shadow-lg shadow-red-500/20"
            >
              <Trash2 className="w-5 h-5" />
              <span>حذف ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Search and Filters Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                  activeTab === tab.name
                  ? 'bg-[#0F3B73] text-white border-[#0F3B73] shadow-lg scale-105'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو الهاتف أو التتبع..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-800 placeholder-slate-400 focus:border-[#0F3B73] focus:bg-white focus:outline-none shadow-inner text-right transition-all"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead className="bg-[#f8fafc] border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 w-16">
                   <button 
                    onClick={toggleSelectAll} 
                    className={`transition-colors ${selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? 'text-[#0F3B73]' : 'text-slate-300 hover:text-slate-400'}`}
                   >
                     {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 
                       ? <CheckSquare className="w-7 h-7" /> 
                       : <Square className="w-7 h-7" />}
                   </button>
                </th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm tracking-wide">رقم الطلب</th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm tracking-wide">رقم الشحنة</th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm tracking-wide">العميل</th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm text-center tracking-wide">عدد القطع</th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm text-center tracking-wide">التاريخ</th>
                <th className="px-6 py-5 text-slate-500 font-bold text-sm tracking-wide">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-300 font-bold text-lg">
                    لا توجد بيانات متاحة حالياً
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => (
                  <tr key={order.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.includes(order.id) ? 'bg-[#0F3B73]/5' : ''}`}>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => toggleSelectOne(order.id)} 
                        className={`transition-colors ${selectedIds.includes(order.id) ? 'text-[#0F3B73]' : 'text-slate-300 group-hover:text-slate-400'}`}
                      >
                         {selectedIds.includes(order.id) 
                           ? <CheckSquare className="w-7 h-7" /> 
                           : <Square className="w-7 h-7" />}
                      </button>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-800">{order.id}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-500">{order.trackingNumber}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-bold text-slate-800">{order.customerName}</span>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-en">
                          <MessageCircle className="w-3.5 h-3.5 text-[#10b981]" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-800 text-center">{order.pieces}</td>
                    <td className="px-6 py-5 font-en font-bold text-slate-500 text-center">{order.date}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-2 rounded-xl font-bold text-[11px] whitespace-nowrap shadow-sm border ${
                        order.status === 'delivered' ? 'bg-[#E5F5D0] text-[#10b981] border-[#10b981]/10' :
                        order.status === 'merchant_pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {order.status === 'delivered' ? 'تم التسليم' : 
                         order.status === 'merchant_pending' ? 'جديد' : 'قيد المعالجة'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal Layer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-800">إنشاء طلب جديد</h2>
                <div className="w-10 h-10 bg-[#0F3B73] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#0F3B73]/30">
                  <Plus className="w-6 h-6 stroke-[3px]" />
                </div>
              </div>
            </div>

            <div className="space-y-8 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
              {/* Section 1: تفاصيل الطلب */}
              <div className="space-y-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[#0F3B73] font-bold text-sm tracking-wide">تفاصيل الطلب</span>
                  <div className="w-20 h-0.5 bg-[#0F3B73] rounded-full opacity-20"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">عدد القطع <span className="text-red-500">*</span></label>
                    <input type="number" min="1" value={newOrder.pieces} onChange={e => setNewOrder({...newOrder, pieces: parseInt(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-center text-slate-800 focus:bg-white focus:border-[#0F3B73] focus:ring-4 focus:ring-[#0F3B73]/5 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">رقم الشحنة (اختياري)</label>
                    <input type="text" value={newOrder.trackingNumber} onChange={e => setNewOrder({...newOrder, trackingNumber: e.target.value})} placeholder="رقم الباركود أو الوصل" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">رقم الطلب (تلقائي)</label>
                    <input type="text" value="10018" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 font-en font-black text-center text-emerald-600 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Section 2: بيانات العميل */}
              <div className="space-y-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[#0F3B73] font-bold text-sm tracking-wide">بيانات العميل</span>
                  <div className="w-20 h-0.5 bg-[#0F3B73] rounded-full opacity-20"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input type="text" value={newOrder.customerPhone} onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})} placeholder="07xxxxxxxxx" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-en font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">الاسم الكامل <span className="text-red-500">*</span></label>
                    <input type="text" value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} placeholder="اسم المستلم" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                </div>
              </div>

              {/* Section 3: تفاصيل الشحنة */}
              <div className="space-y-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[#0F3B73] font-bold text-sm tracking-wide">تفاصيل الشحنة</span>
                  <div className="w-20 h-0.5 bg-[#0F3B73] rounded-full opacity-20"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">اقرب نقطة دالة <span className="text-red-500">*</span></label>
                    <input type="text" value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} placeholder="أقرب نقطة دالة أو معلم معروف" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="block text-slate-600 font-bold text-xs text-right">المنطقة / الحي <span className="text-red-500">*</span></label>
                       <input type="text" placeholder="المنصور، الكرادة، إلخ" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold text-xs text-right">محافظة التوصيل <span className="text-red-500">*</span></label>
                      <select value={newOrder.province} onChange={e => setNewOrder({...newOrder, province: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 focus:bg-white focus:border-[#0F3B73] transition-all outline-none appearance-none cursor-pointer">
                        <option value="">اختر المحافظة</option>
                        <option>بغداد</option>
                        <option>البصرة</option>
                        <option>نينوى</option>
                        <option>أربيل</option>
                        <option>النجف</option>
                        <option>كربلاء</option>
                        <option>ذي قار</option>
                        <option>بابل</option>
                        <option>الأنبار</option>
                        <option>كركوك</option>
                        <option>صلاح الدين</option>
                        <option>ديالى</option>
                        <option>ميسان</option>
                        <option>القادسية</option>
                        <option>المثنى</option>
                        <option>واسط</option>
                        <option>السليمانية</option>
                        <option>دهوك</option>
                        <option>حلبجة</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
              <button 
                onClick={handleCreateOrder}
                className="w-full bg-[#0F3B73] text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-[#0F3B73]/20"
              >
                تأكيد الإضافة
              </button>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-full bg-slate-50 text-slate-400 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                إلغاء العملية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


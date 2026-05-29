import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, FileDown, Trash2, Search, 
  Star, Warehouse, Truck, Building2, 
  ChevronLeft, MessageCircle, X, CheckSquare, Square,
  ArrowRight, Package, Clock, RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders, MainOrder } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders, addOrder, deleteOrder } = useOrders();
  const { getDeliveryFee, governorates, requireMerchantApproval } = useSettings();
  const merchantOrders = orders.filter(o => o.merchantId === user?.id);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const queryStatus = searchParams.get('status');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get('action') === 'add');
  
  // New order state
  const [newOrder, setNewOrder] = useState({
    pieces: 1, trackingNumber: '', customerPhone: '', customerName: '', address: '', province: '', amount: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs configuration mappings to OrderStatus
  const stats = [
    {
      title: 'بحوزة المندوب',
      count: merchantOrders.filter(o => o.status === 'driver_assigned').length,
      icon: <Truck className="w-8 h-8 text-black/50" />,
      bg: 'bg-[#ffff00]', // Bright Yellow
      textColor: 'text-black',
      statusId: 'driver_assigned'
    },
    {
      title: 'في المخزن الرئيسي',
      count: merchantOrders.filter(o => o.status === 'main_warehouse').length,
      icon: <Warehouse className="w-8 h-8 text-black/50" />,
      bg: 'bg-[#fbc02d]',
      textColor: 'text-black',
      statusId: 'main_warehouse'
    },
    {
      title: 'في مخزن الفرع',
      count: merchantOrders.filter(o => o.status === 'branch_warehouse').length,
      icon: <Building2 className="w-8 h-8 text-black/50" />,
      bg: 'bg-[#f57f17]',
      textColor: 'text-black',
      statusId: 'branch_warehouse'
    },
    {
      title: 'قيد التنفيذ',
      count: merchantOrders.filter(o => ['merchant_pending', 'branch_transfering'].includes(o.status)).length,
      icon: <Star className="w-8 h-8 text-black/50" />,
      bg: 'bg-[#ffeb3b]', // Yellow
      textColor: 'text-black',
      statusId: 'pending'
    },
    {
      title: 'مؤجل',
      count: merchantOrders.filter(o => o.status === 'postponed').length,
      icon: <Clock className="w-8 h-8 text-black/50" />,
      bg: 'bg-[#ff9800]', // Orange
      textColor: 'text-black',
      statusId: 'postponed'
    },
    {
      title: 'تم التسليم',
      count: merchantOrders.filter(o => o.status === 'delivered').length,
      icon: <Building2 className="w-8 h-8 text-white/50" />,
      bg: 'bg-[#4caf50]', // Green
      textColor: 'text-white',
      statusId: 'delivered'
    },
    {
      title: 'واصل جزئي',
      count: merchantOrders.filter(o => o.status === 'delivered_partial').length,
      icon: <Package className="w-8 h-8 text-white/50" />,
      bg: 'bg-[#388e3c]', // Dark Green
      textColor: 'text-white',
      statusId: 'delivered_partial'
    },
    {
      title: 'رفض',
      count: merchantOrders.filter(o => o.status === 'returned').length,
      icon: <RotateCcw className="w-8 h-8 text-white/50" />,
      bg: 'bg-[#f44336]', // Red
      textColor: 'text-white',
      statusId: 'returned'
    },
    {
      title: 'راجع مخزن',
      count: merchantOrders.filter(o => o.status === 'returned_to_merchant').length,
      icon: <RotateCcw className="w-8 h-8 text-white/50" />,
      bg: 'bg-[#9c27b0]', // Purple
      textColor: 'text-white',
      statusId: 'returned_to_merchant'
    },
    {
      title: 'راجع جزئي',
      count: merchantOrders.filter(o => o.status === 'returned_partial').length,
      icon: <RotateCcw className="w-8 h-8 text-white/50" />,
      bg: 'bg-[#ab47bc]', // Lighter Purple
      textColor: 'text-white',
      statusId: 'returned_partial'
    },
    // The following two are requested but no clear logic to determine them yet.
    // {
    //   title: 'تم محاسبة المندوب',
    //   count: 0,
    //   icon: <Receipt className="w-8 h-8 text-white/50" />,
    //   bg: 'bg-[#1e1e24]',
    //   textColor: 'text-white',
    //   statusId: 'driver_accounted'
    // },
    // {
    //   title: 'تم محاسبة العميل',
    //   count: 0,
    //   icon: <Receipt className="w-8 h-8 text-white/50" />,
    //   bg: 'bg-[#1a237e]',
    //   textColor: 'text-white',
    //   statusId: 'customer_accounted'
    // }
  ];

  // Filter and Search Logic
  let filteredOrders = useMemo(() => {
    return merchantOrders.filter(order => {
      let matchesStatus = true;
      if (activeTab && activeTab !== 'all') {
        if (activeTab === 'pending') {
          matchesStatus = ['merchant_pending', 'branch_transfering'].includes(order.status);
        } else {
          matchesStatus = order.status === activeTab;
        }
      }

      const matchesSearch = 
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [merchantOrders, activeTab, searchQuery, queryStatus]);

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
    if(!newOrder.customerName || !newOrder.customerPhone || !newOrder.province || !newOrder.amount) {
       alert("الرجاء ملء كافة الحقول المطلوبة (الاسم، الهاتف، المحافظة، المبلغ)");
       return;
    }
    const deliveryFee = getDeliveryFee(newOrder.province, user?.id || 'merch-1');
    const totalAmount = parseFloat(newOrder.amount) || 0;
    const amountForMerchant = totalAmount - deliveryFee;
    
    // Check if admin approval is required
    const initialStatus = requireMerchantApproval ? 'merchant_pending' : 'main_warehouse';

    const order: MainOrder = {
       id: `ORD-${1000 + orders.length + 1}`,
       trackingNumber: newOrder.trackingNumber || `SHP-${Math.floor(Math.random() * 100000)}`,
       merchantId: user?.id || 'merch-1',
       merchantName: user?.name || 'التاجر الحالي',
       customerName: newOrder.customerName,
       customerPhone: newOrder.customerPhone,
       address: newOrder.address,
       province: newOrder.province,
       
       amount: amountForMerchant, 
       totalAmount: totalAmount,
       deliveryFee: deliveryFee,
       orderAmount: amountForMerchant,
       collectedAmount: 0,
       merchantDue: amountForMerchant,
       driverCommission: 0, // This will be calculated later when assigned/delivered
       companyProfit: deliveryFee,
       financialStatus: 'pending',

       date: new Date().toISOString().split('T')[0],
       pieces: newOrder.pieces,
       status: initialStatus
    };
    addOrder(order);
    setIsAddModalOpen(false);
    if (requireMerchantApproval) {
      alert('تم إضافة الطلب بنجاح. هو الآن بانتظار استلام المخزن الرئيسي.');
    } else {
      alert('تم إضافة الطلب بنجاح وهو الآن في المخزن الرئيسي.');
    }
    setNewOrder({ pieces: 1, trackingNumber: '', customerPhone: '', customerName: '', address: '', province: '', amount: '' });
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

        {/* Search and Filters Card / Cards View */}
        {viewMode === 'cards' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* The "All" Tab which is not in stats */}
              <div 
                onClick={() => { setActiveTab('all'); setViewMode('table'); }}
                className={`bg-slate-100 text-slate-800 p-5 rounded-2xl flex items-center shadow-sm hover:shadow-md transform transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
              >
                <div className="flex flex-col gap-1 w-full z-10">
                   <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-base opacity-90 tracking-wide mt-1">الكل</p>
                     <div><Package className="w-8 h-8 opacity-50" /></div>
                   </div>
                   <h2 className="text-4xl font-black text-right">{merchantOrders.length}</h2>
                </div>
              </div>
              
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setActiveTab(stat.statusId); setViewMode('table'); }}
                  className={`${stat.bg} ${stat.textColor} p-5 rounded-2xl flex items-center shadow-sm hover:shadow-md transform transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
                >
                  <div className="flex flex-col gap-1 w-full z-10">
                     <div className="flex justify-between items-start mb-2">
                       <p className="font-bold text-base opacity-90 tracking-wide mt-1">{stat.title}</p>
                       <div>{stat.icon}</div>
                     </div>
                     <h2 className="text-4xl font-black font-en text-right">{stat.count}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Back to cards button */}
              <button 
                onClick={() => setViewMode('cards')}
                className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm w-full md:w-auto"
              >
                <ChevronLeft className="w-5 h-5 opacity-50" />
                العودة للبطاقات
              </button>
              
              {/* Search bar inside table view */}
              <div className="relative flex-1 w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو الهاتف أو التتبع..." 
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-800 placeholder-slate-400 focus:border-[#0F3B73] focus:outline-none shadow-sm text-right transition-all"
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
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          </div>
        )}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">المبلغ الكلي للطلب (مع التوصيل) <span className="text-red-500">*</span></label>
                    <input type="number" min="0" value={newOrder.amount} onChange={e => setNewOrder({...newOrder, amount: e.target.value})} placeholder="المبلغ المطلوب من العميل" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-center text-slate-800 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">عدد القطع <span className="text-red-500">*</span></label>
                    <input type="number" min="1" value={newOrder.pieces} onChange={e => setNewOrder({...newOrder, pieces: parseInt(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-center text-slate-800 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">رقم الشحنة (اختياري)</label>
                    <input type="text" value={newOrder.trackingNumber} onChange={e => setNewOrder({...newOrder, trackingNumber: e.target.value})} placeholder="رقم الباركود أو الوصل" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600 font-bold text-xs text-right">رقم الطلب (تلقائي)</label>
                    <input type="text" value="جديد" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 font-en font-black text-center text-emerald-600 cursor-not-allowed" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="block text-slate-600 font-bold text-xs text-right">المنطقة / الحي \ أقرب نقطة دالة <span className="text-red-500">*</span></label>
                       <input type="text" value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} placeholder="المنصور، الكرادة، إلخ" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 placeholder-slate-300 focus:bg-white focus:border-[#0F3B73] transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold text-xs text-right">محافظة التوصيل <span className="text-red-500">*</span></label>
                      <select value={newOrder.province} onChange={e => setNewOrder({...newOrder, province: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-right text-slate-800 focus:bg-white focus:border-[#0F3B73] transition-all outline-none appearance-none cursor-pointer">
                        <option value="">اختر المحافظة</option>
                        {governorates.filter(g => g.active !== false).map(g => {
                          const fee = getDeliveryFee(g.name, user?.id);
                          return (
                          <option key={g.id} value={g.name} label={`${g.name} (توصيل: ${fee.toLocaleString()} د.ع)`}>
                            {g.name} (توصيل: {fee.toLocaleString()} د.ع)
                          </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">تفاصيل السعر</label>
                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between text-slate-500">
                          <span>المبلغ الكلي :</span>
                          <span className="font-en">{newOrder.amount ? Number(newOrder.amount).toLocaleString() : 0} د.ع</span>
                        </div>
                        <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                          <span>أجرة التوصيل ({newOrder.province || 'لم تحدد'}):</span>
                          <span className="font-en">{newOrder.province ? getDeliveryFee(newOrder.province, user?.id || 'merch-1').toLocaleString() : 0} د.ع</span>
                        </div>
                        <div className="flex justify-between text-[#0F3B73] pt-2">
                          <span>سعر المنتجات الصافي للتاجر:</span>
                          <span className="font-en text-lg block">{
                            Math.max(0, ((parseFloat(newOrder.amount) || 0) - (newOrder.province ? getDeliveryFee(newOrder.province, user?.id || 'merch-1') : 0))).toLocaleString()
                          } د.ع</span>
                        </div>
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


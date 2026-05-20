import React from "react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import { MainOrder } from "../context/OrderContext";
import { useUsers } from "../context/UserContext";

interface ThermalLabelProps {
  order: MainOrder;
}

export const ThermalLabel = React.forwardRef<HTMLDivElement, ThermalLabelProps>(
  ({ order }, ref) => {
    const { users } = useUsers();
    const merchant = users.find(u => u.name === order.merchantName || u.id === order.merchantId);

    const orderAmount = order.amount || 0;
    const deliveryFee = order.deliveryFee || 0;
    const totalAmount = orderAmount + deliveryFee;

    return (
      <div
        ref={ref}
        className="thermal-label-container bg-white text-black flex flex-col"
        style={{
          width: "100mm",
          height: "150mm",
          padding: "2mm",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          className="w-full h-full border-[3px] border-black rounded-xl flex flex-col p-2 space-y-2 relative"
          style={{ boxSizing: "border-box" }}
          dir="rtl"
        >
          {/* Header Section */}
          <div className="flex border-b-[3px] border-black pb-2 items-start justify-between shrink-0">
            <div className="text-right w-[35%]">
              <div className="font-bold text-sm mb-1">بيانات الشحنة</div>
              <div className="text-xs font-bold leading-tight">
                رقم :{" "}
                <span className="font-en tracking-tighter" dir="ltr">
                  {order.trackingNumber}
                </span>
              </div>
              <div className="text-xs font-bold leading-tight mt-0.5">
                تاريخ :{" "}
                <span className="font-en tracking-tighter">
                  {new Date(order.date).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>

            <div className="text-center w-[40%] flex flex-col items-center pt-1">
              <h1 className="font-black text-[12px] leading-tight uppercase relative inline-block">
                شركة الراصد
                <div className="absolute w-[120%] h-[1px] bg-black -bottom-1 -left-[10%]"></div>
              </h1>
              <h2 className="font-bold text-[10px] leading-tight mt-1.5 w-full whitespace-nowrap">
                للتوصيل السريع
              </h2>
            </div>

            <div className="w-[25%] flex justify-end">
              <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center font-black text-[10px] text-center rounded-lg">
                LOGO
              </div>
            </div>
          </div>

          {/* Customer Information Grid */}
          <div className="shrink-0 pt-1 space-y-2 relative">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold whitespace-nowrap">المحافظة:</span>
              <span className="text-[12px] font-bold">{order.province}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold whitespace-nowrap">
                منطقة
                <br />
                نقطة دالة:
              </span>
              <span
                className="text-sm font-bold pt-1 leading-tight flex-1"
                style={{
                  wordBreak: "break-word",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {order.address}
              </span>
            </div>

            {/* Divider between address and phone */}
            <div className="w-full h-[3px] bg-black my-1"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold whitespace-nowrap">
                رقم الهاتف:
              </span>
              <span className="text-[12px] font-en font-black tracking-wide">
                {order.customerPhone}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold whitespace-nowrap">
                عدد القطع:
              </span>
              <span className="text-lg font-en font-bold">
                {order.pieces || 1}
              </span>
            </div>
          </div>

          {/* Financial Section */}
          <div className="mt-2 text-white p-3 flex justify-start gap-4 items-center shrink-0 w-[105%] -mx-[2.5%] relative overflow-hidden h-[18mm]">
            <div className="absolute inset-0 bg-black"></div>
            <span className="text-[12px] font-bold relative z-10 mr-4 whitespace-nowrap">
              المبلغ الإجمالي:
            </span>
            <span
              className="text-[12px] font-en font-black relative z-10 tracking-tight flex items-baseline gap-1"
              dir="rtl"
            >
              <span className="text-[12px]">د.ع</span>{" "}
              {totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Merchant Notes & Details */}
          <div className="text-sm leading-tight shrink-0 pt-1 relative">
            {/* Notes line */}
            <div className="flex flex-col mb-2 relative">
              <div className="flex z-10 w-full">
                <span className="font-bold text-[11px] whitespace-nowrap ml-1 bg-white pr-1 text-slate-500">
                  ملاحظات:
                </span>
                <span className="text-xs font-bold leading-tight">
                  الرجاء الاتصال قبل التوصيل
                </span>
              </div>
              {/* Dots */}
              <div className="w-full border-b-[2px] border-dotted border-black mt-1"></div>
            </div>

            <div className="flex flex-col z-10 w-full mt-1 relative bg-white">
              <div className="flex items-center w-full overflow-hidden">
                <span className="font-bold text-xs whitespace-nowrap ml-1 pr-1 shrink-0">
                  اسم المتجر:{" "}
                </span>
                <span className="text-sm font-bold leading-none truncate mt-0.5">
                  {order.merchantName}
                </span>
              </div>
              {merchant?.phone && (
                <div className="flex items-center w-full mt-1.5">
                  <span className="font-bold text-[11px] whitespace-nowrap ml-1 pr-1 text-slate-500 shrink-0">
                    هاتف المتجر:
                  </span>
                  <span className="text-[12px] font-bold font-en tracking-wide leading-none dir-ltr truncate">
                    {merchant.phone}
                  </span>
                </div>
              )}
            </div>
            {/* Dots */}
            <div className="w-full border-b-[2px] border-dotted border-black mt-2"></div>
          </div>

          {/* Barcode & QR Footer */}
          <div className="flex items-center mt-auto pb-1 shrink-0 px-2 my-2 justify-between w-full h-[25mm]">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="font-bold font-en text-lg tracking-widest leading-none bg-white z-10 translate-y-2">
                {order.id}
              </div>
              <div className="h-16 flex items-center justify-center">
                <Barcode
                  value={order.id}
                  format="CODE128"
                  width={2}
                  height={55}
                  displayValue={false}
                  margin={0}
                  background="#ffffff"
                  lineColor="#000000"
                />
              </div>
            </div>

            <div
              className="border-[3px] border-black p-1 bg-white shrink-0 ml-1 flex items-center justify-center"
              style={{ width: "22mm", height: "22mm" }}
            >
              <QRCode
                value={JSON.stringify({
                  id: order.id,
                  tracking: order.trackingNumber,
                  phone: order.customerPhone,
                })}
                size={76}
                level="L"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ThermalLabel.displayName = "ThermalLabel";

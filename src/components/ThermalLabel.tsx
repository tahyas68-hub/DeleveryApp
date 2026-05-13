import React from "react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import { MainOrder } from "../context/OrderContext";

interface ThermalLabelProps {
  order: MainOrder;
}

export const ThermalLabel = React.forwardRef<HTMLDivElement, ThermalLabelProps>(
  ({ order }, ref) => {
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
              <h1 className="font-black text-lg leading-tight uppercase relative inline-block">
                شركة الراصد
                <div className="absolute w-[120%] h-[1px] bg-black -bottom-1 -left-[10%]"></div>
              </h1>
              <h2 className="font-bold text-sm leading-tight mt-1.5 w-full whitespace-nowrap">
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
            <div className="flex items-center">
              <span className="text-sm font-bold w-16 shrink-0">المحافظة:</span>
              <span className="text-xl font-bold px-2">{order.province}</span>
            </div>

            <div className="flex items-baseline">
              <span className="text-[10px] font-bold w-12 shrink-0">
                منطقة
                <br />
                نقطة دالة:
              </span>
              <span
                className="text-base font-bold pr-1 pt-1 leading-tight flex-1"
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

            <div className="flex items-center">
              <span className="text-sm font-bold w-16 shrink-0">
                رقم الهاتف:
              </span>
              <span className="text-2xl font-en font-black px-2 tracking-wide">
                {order.customerPhone}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-sm font-bold w-16 shrink-0">
                عدد القطع:
              </span>
              <span className="text-xl font-en font-bold px-2">
                {order.pieces || 1}
              </span>
            </div>
          </div>

          {/* Financial Section */}
          <div className="mt-2 text-white p-3 flex justify-between items-center shrink-0 w-[105%] -mx-[2.5%] relative overflow-hidden h-[18mm]">
            <div className="absolute inset-0 bg-black"></div>
            <span className="text-lg font-bold relative z-10 mr-4">
              المبلغ الإجمالي:
            </span>
            <span
              className="text-3xl font-en font-black relative z-10 ml-4 tracking-tight flex items-baseline gap-1"
              dir="rtl"
            >
              <span className="text-lg">د.ع</span>{" "}
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

            <div className="flex z-10 w-full mt-2 relative">
              <span className="font-bold text-xs whitespace-nowrap ml-2 bg-white pr-1">
                اسم المتجر:{" "}
              </span>
              <span className="text-lg font-bold leading-none -mt-0.5">
                {order.merchantName}
              </span>
            </div>
            {/* Dots */}
            <div className="w-full border-b-[2px] border-dotted border-black mt-[14px]"></div>
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

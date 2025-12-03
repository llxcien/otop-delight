import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Printer, Home, AlertCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const { order, orderId } = location.state as { order: any; orderId: string } || {};

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  if (!order) return null;

  const handlePrint = () => window.print();

  // เช็คสถานะการจ่ายเงิน
  const isUnpaid = order.status === 'unpaid';

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header Message */}
        <div className="mb-8 text-center print:hidden">
          <div className="mb-4 flex justify-center">
             {isUnpaid ? (
                 <AlertCircle className="h-16 w-16 text-yellow-500" />
             ) : (
                 <CheckCircle className="h-16 w-16 text-green-500" />
             )}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
              {isUnpaid ? "บันทึกคำสั่งซื้อสำเร็จ" : "ชำระเงินสำเร็จ!"}
          </h1>
          <p className="text-muted-foreground">
              {isUnpaid 
                ? "กรุณาเตรียมเงินสดสำหรับชำระปลายทาง (COD)" 
                : "ขอบคุณที่อุดหนุนสินค้าชุมชน OTOP"}
          </p>
        </div>

        {/* Receipt Card */}
        <div className="mx-auto max-w-2xl">
          <div ref={receiptRef} className="bg-white text-black shadow-lg print:shadow-none p-0 rounded-lg overflow-hidden">
            <Card className="border-0 sm:border rounded-none shadow-none">
              <CardHeader className="text-center border-b pb-6 bg-slate-50">
                <CardTitle className="text-2xl font-bold uppercase tracking-widest">OTOP Receipt</CardTitle>
                <div className="text-sm text-muted-foreground mt-2">
                  Order ID: <span className="font-mono text-black">{orderId}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  วันที่: {new Date(order.date).toLocaleString('th-TH')}
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {/* Customer Info */}
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">ผู้สั่งซื้อ</h3>
                    <p>{order.customer.name}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                  <div className="sm:text-right">
                    <h3 className="font-bold text-gray-900 mb-1">จัดส่งที่</h3>
                    <p className="whitespace-pre-wrap text-gray-600">{order.customer.address}</p>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">รายการสินค้า</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex gap-3">
                          <span className="font-mono text-gray-500 w-6 text-center">{item.quantity}x</span>
                          <span className="text-gray-800">{item.name}</span>
                        </div>
                        <span className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown (ส่วนสำคัญที่ขอมา) */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">รวมราคาสินค้า (Subtotal)</span>
                    <span>฿{order.subtotal?.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        ค่าจัดส่ง ({order.customer?.shippingMethod === 'express' ? 'EMS' : 'Standard'})
                    </span>
                    <span>฿{order.shippingCost?.toLocaleString()}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                        <span>ส่วนลด (Coupon)</span>
                        <span>-฿{order.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator className="my-3" />

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">ยอดสุทธิ (Total)</span>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-primary">฿{order.total.toLocaleString()}</div>
                        <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block mt-2 ${isUnpaid ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {isUnpaid ? 'รอชำระเงิน (COD)' : 'ชำระเงินแล้ว (PAID)'}
                        </div>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50 p-6 text-center text-xs text-muted-foreground flex justify-center">
                <p>ขอบคุณที่สนับสนุนสินค้าภูมิปัญญาไทย</p>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center print:hidden">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" /> กลับหน้าหลัก
            </Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> พิมพ์ใบเสร็จ
            </Button>
          </div>
        </div>
      </div>
      
      {/* CSS สำหรับ Print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #root { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          div[class*="bg-white"] {
            visibility: visible; position: absolute; left: 0; top: 0; width: 100%; box-shadow: none;
          }
          div[class*="bg-white"] * { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
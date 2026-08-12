import {
  Calendar,
  CreditCard,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  X
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import React, { useRef } from "react";
import { RegisteredUser } from "../schemas/registeredUsersSchema";

interface RegisteredUserQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RegisteredUser | null;
}

export const RegisteredUserQrModal: React.FC<RegisteredUserQrModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !user || !user.generatedId) return null;

  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `QR_Pass_${user.thaiName || user.idCard || "User"}_${user.generatedId.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Expiration date format
  const expDateStr = user.expiredDate
    ? user.expiredDate.split("T")[0]
    : "Indefinite";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200'>
      <div className='relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black'>
        {/* Modal Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 print:hidden'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'>
              <QrCode className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-base font-bold text-white'>
                Digital QR Access Pass
              </h2>
              <p className='text-xs text-slate-400'>
                Generated from System UUID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Pass Card Container */}
        <div className='p-6 text-center space-y-6'>
          {/* Card Badge Header */}
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider print:border-slate-300 print:text-emerald-700'>
            <ShieldCheck className='w-3.5 h-3.5' /> Clearance Verified
          </div>

          {/* User Name & Details */}
          <div className='space-y-1'>
            <h3 className='text-2xl font-extrabold text-white tracking-tight print:text-slate-900'>
              {user.thaiName || "Unnamed User"}
            </h3>
            {user.engName && (
              <p className='text-sm text-slate-400 font-medium print:text-slate-600'>
                {user.engName}
              </p>
            )}
            <p className='text-xs text-slate-400 pt-1 flex items-center justify-center gap-2 print:text-slate-600'>
              <span className='px-2.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-semibold uppercase tracking-wider border border-slate-700 print:bg-slate-100 print:text-slate-800'>
                {user.type || "Standard"}
              </span>
              <span>•</span>
              <span className='flex items-center gap-1 font-mono'>
                <CreditCard className='w-3.5 h-3.5 text-slate-500' />
                {user.idCard || "No ID Card"}
              </span>
            </p>
          </div>

          {/* QR Code Graphic Box */}
          <div className='flex justify-center my-4'>
            <div
              ref={qrCanvasRef}
              className='p-4 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/20 inline-block transform hover:scale-105 transition-transform'
            >
              <QRCodeCanvas
                value={user.generatedId}
                size={220}
                bgColor='#ffffff'
                fgColor='#022c22' // emerald-950
                level='H'
                includeMargin={true}
              />
            </div>
          </div>

          {/* UUID Details */}
          <div className='p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1 print:bg-slate-50 print:border-slate-300'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600'>
              UUID Token
            </p>
            <p className='text-xs font-mono text-emerald-400 font-semibold break-all select-all print:text-slate-900'>
              {user.generatedId}
            </p>
            <div className='flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1 print:text-slate-600'>
              <Calendar className='w-3 h-3 text-slate-500' />
              <span>
                Valid Until: <strong>{expDateStr}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-center gap-3 pt-2 print:hidden'>
            <button
              onClick={handleDownloadQr}
              className='px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2'
            >
              <Download className='w-4 h-4' />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className='px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2'
            >
              <Printer className='w-4 h-4' />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

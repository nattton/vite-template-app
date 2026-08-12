import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building,
  Calendar,
  Camera,
  Car,
  Clock,
  CreditCard,
  LogOut,
  MapPin,
  Shield,
  Tag,
  User,
} from "lucide-react";
import React, { useRef, useState } from "react";
import {
  useCheckoutVisitorMutation,
  useUploadVisitorPhotoMutation,
} from "../api/visitorsApi";
import { Visitor, VisitorImage } from "../schemas/visitorsSchema";

interface VisitorDetailCardProps {
  visitor: Visitor;
}

export const VisitorDetailCard: React.FC<VisitorDetailCardProps> = ({
  visitor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkoutMutation = useCheckoutVisitorMutation();
  const uploadPhotoMutation = useUploadVisitorPhotoMutation();

  const [uploadError, setUploadError] = useState<string | null>(null);

  const isOnSite = !visitor.exitTime;

  const handleCheckout = async () => {
    if (!visitor.createdAt) return;

    const dateObj = new Date(visitor.createdAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const barcodeStr = `${dateObj.getFullYear()}${pad(dateObj.getMonth() + 1)}${pad(dateObj.getDate())}${pad(dateObj.getHours())}${pad(dateObj.getMinutes())}${pad(dateObj.getSeconds())}.000`;

    if (
      window.confirm(
        `Confirm checkout for visitor plate "${visitor.plateNumber}"?`,
      )
    ) {
      try {
        await checkoutMutation.mutateAsync({
          barcode: barcodeStr,
          gateLogId: visitor.gateLogId,
        });
      } catch (err: any) {
        alert(err?.response?.data?.error || err?.message || "Checkout failed");
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      await uploadPhotoMutation.mutateAsync({
        id: visitor.id,
        file,
      });
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.error || err?.message || "Failed to upload photo",
      );
    }
  };

  // Timestamps & Duration
  const entryDate = visitor.createdAt ? new Date(visitor.createdAt) : null;
  const exitDate = visitor.exitTime ? new Date(visitor.exitTime) : null;

  const getDurationString = () => {
    if (!entryDate) return "N/A";
    const end = exitDate || new Date();
    const diffMs = end.getTime() - entryDate.getTime();
    if (diffMs < 0) return "0 mins";

    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  // Photo URL resolver
  const photoUrl = visitor.photo
    ? visitor.photo.startsWith("http")
      ? visitor.photo
      : `http://localhost:4000/anpr_store${visitor.photo}`
    : null;

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      {/* Back Link */}
      <div>
        <Link
          to='/visitors'
          className='inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Back to Visitors Directory</span>
        </Link>
      </div>

      {/* Hero Card */}
      <div className='p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80'>
          <div className='flex items-center gap-5'>
            {/* Photo Avatar */}
            <div className='relative group shrink-0'>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={visitor.plateNumber}
                  className='w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/30 shadow-xl bg-slate-950'
                />
              ) : (
                <div className='w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-3xl shadow-inner'>
                  <Car className='w-10 h-10' />
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhotoMutation.isPending}
                className='absolute inset-0 rounded-2xl bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-semibold text-white gap-1 backdrop-blur-xs'
                title='Upload photo'
              >
                <Camera className='w-4 h-4 text-amber-400' />
                <span>Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handlePhotoUpload}
                className='hidden'
              />
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center gap-3'>
                <span className='px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono font-extrabold text-2xl text-amber-300 tracking-wider shadow-inner'>
                  {visitor.plateNumber || "NO PLATE"}
                </span>
                {isOnSite ? (
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-amber-400 animate-ping' />
                    Currently On-Site
                  </span>
                ) : (
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700'>
                    Checked Out
                  </span>
                )}
              </div>

              <p className='text-xs text-slate-400 flex items-center gap-2 pt-1'>
                <Tag className='w-3.5 h-3.5 text-slate-500' />
                <span className='uppercase font-semibold text-slate-200'>
                  Type: {visitor.type || "Car"}
                </span>
                <span>•</span>
                <span className='font-mono text-slate-500'>ID #{visitor.id}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-3'>
            {isOnSite && (
              <button
                onClick={handleCheckout}
                disabled={checkoutMutation.isPending}
                className='px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50'
              >
                <LogOut className='w-4 h-4' />
                <span>{checkoutMutation.isPending ? "Checking out..." : "Checkout Visitor"}</span>
              </button>
            )}
          </div>
        </div>

        {uploadError && (
          <div className='p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2'>
            <span>{uploadError}</span>
          </div>
        )}

        {/* Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Entry Time */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Clock className='w-4 h-4 text-emerald-400' />
              <span>Entry Time</span>
            </div>
            <p className='text-sm font-mono font-semibold text-slate-100'>
              {entryDate ? entryDate.toLocaleString("th-TH") : "—"}
            </p>
          </div>

          {/* Exit Time */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <LogOut className='w-4 h-4 text-amber-400' />
              <span>Exit Time</span>
            </div>
            <p className='text-sm font-mono font-semibold text-slate-100'>
              {exitDate ? exitDate.toLocaleString("th-TH") : "Still On-Site"}
            </p>
          </div>

          {/* Duration */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Calendar className='w-4 h-4 text-cyan-400' />
              <span>Duration On-Site</span>
            </div>
            <p className='text-sm font-mono font-bold text-cyan-300'>
              {getDurationString()}
            </p>
          </div>
        </div>

        {/* Visited Member Unit */}
        <div className='p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Building className='w-4 h-4 text-indigo-400' />
              <span>Visited Member Unit</span>
            </div>
            {visitor.member?.id && (
              <Link
                to='/members/$id'
                params={{ id: String(visitor.member.id) }}
                className='text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors'
              >
                View Unit Details →
              </Link>
            )}
          </div>
          {visitor.member?.name ? (
            <div className='flex items-center gap-3'>
              <p className='text-lg font-bold text-white'>
                Unit {visitor.member.name}
              </p>
              <span className='px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium uppercase'>
                {visitor.member.type || "resident"}
              </span>
            </div>
          ) : (
            <p className='text-sm text-slate-500 italic'>
              No specific member unit associated with this entry.
            </p>
          )}
        </div>

        {/* Visitor Credentials */}
        {(visitor.thaiName || visitor.idCard || visitor.address) && (
          <div className='p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3'>
              <Shield className='w-4 h-4 text-amber-400' />
              <span>Visitor Identity Credentials</span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <p className='text-xs text-slate-500 uppercase font-semibold'>Name</p>
                <p className='text-slate-100 font-semibold flex items-center gap-1.5 pt-0.5'>
                  <User className='w-4 h-4 text-slate-400' />
                  {visitor.thaiName || visitor.engName || "—"}
                </p>
              </div>
              <div>
                <p className='text-xs text-slate-500 uppercase font-semibold'>ID Card</p>
                <p className='text-slate-100 font-mono font-semibold flex items-center gap-1.5 pt-0.5'>
                  <CreditCard className='w-4 h-4 text-slate-400' />
                  {visitor.idCard || "—"}
                </p>
              </div>
              <div>
                <p className='text-xs text-slate-500 uppercase font-semibold'>Address</p>
                <p className='text-slate-300 flex items-center gap-1.5 pt-0.5 truncate'>
                  <MapPin className='w-4 h-4 text-slate-400 shrink-0' />
                  {visitor.address || "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ANPR Gate Detection & Visitor Image Gallery */}
        <div className='space-y-4 pt-2'>
          <h3 className='text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3'>
            <Camera className='w-4 h-4 text-amber-400' />
            <span>ANPR Gate Captures & Image Gallery</span>
          </h3>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {/* Entry Gate ANPR Capture Image */}
            {visitor.gateLog?.captureImage && (
              <div className='group relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 aspect-video shadow-lg'>
                <img
                  src={`http://localhost:4000/anpr_store${visitor.gateLog.captureImage}`}
                  alt='Entry ANPR Capture'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                />
                <div className='absolute inset-x-0 bottom-0 p-1.5 bg-slate-950/85 text-[10px] text-emerald-300 font-mono font-semibold text-center border-t border-emerald-500/30 flex items-center justify-between px-2'>
                  <span>IN DETECTION</span>
                  <span>{visitor.gateLog.anpr}</span>
                </div>
              </div>
            )}

            {/* Entry Gate License Plate Image */}
            {visitor.gateLog?.licensePlateImage && (
              <div className='group relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 aspect-video shadow-lg'>
                <img
                  src={`http://localhost:4000/anpr_store${visitor.gateLog.licensePlateImage}`}
                  alt='Entry License Plate'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                />
                <div className='absolute inset-x-0 bottom-0 p-1.5 bg-slate-950/85 text-[10px] text-emerald-300 font-mono font-semibold text-center border-t border-emerald-500/30 flex items-center justify-between px-2'>
                  <span>IN PLATE</span>
                  <span>{visitor.gateLog.plateNumber}</span>
                </div>
              </div>
            )}

            {/* Exit Gate ANPR Capture Image */}
            {visitor.gateLogOut?.captureImage && (
              <div className='group relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 aspect-video shadow-lg'>
                <img
                  src={`http://localhost:4000/anpr_store${visitor.gateLogOut.captureImage}`}
                  alt='Exit ANPR Capture'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                />
                <div className='absolute inset-x-0 bottom-0 p-1.5 bg-slate-950/85 text-[10px] text-amber-300 font-mono font-semibold text-center border-t border-amber-500/30 flex items-center justify-between px-2'>
                  <span>OUT DETECTION</span>
                  <span>{visitor.gateLogOut.anpr}</span>
                </div>
              </div>
            )}

            {/* Exit Gate License Plate Image */}
            {visitor.gateLogOut?.licensePlateImage && (
              <div className='group relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 aspect-video shadow-lg'>
                <img
                  src={`http://localhost:4000/anpr_store${visitor.gateLogOut.licensePlateImage}`}
                  alt='Exit License Plate'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                />
                <div className='absolute inset-x-0 bottom-0 p-1.5 bg-slate-950/85 text-[10px] text-amber-300 font-mono font-semibold text-center border-t border-amber-500/30 flex items-center justify-between px-2'>
                  <span>OUT PLATE</span>
                  <span>{visitor.gateLogOut.plateNumber}</span>
                </div>
              </div>
            )}

            {/* Additional Visitor Images */}
            {visitor.visitorImages?.map((img: VisitorImage, idx: number) => {
              const src = img.image
                ? img.image.startsWith("http")
                  ? img.image
                  : `http://localhost:4000/anpr_store${img.image}`
                : "";

              return (
                <div
                  key={img.id || idx}
                  className='group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-lg'
                >
                  <img
                    src={src}
                    alt={img.type || "Capture"}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                  />
                  <div className='absolute inset-x-0 bottom-0 p-1.5 bg-slate-950/85 text-[10px] text-slate-300 font-mono font-semibold text-center uppercase border-t border-slate-800'>
                    {img.type || "VISITOR IMAGE"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import {
  AlertCircle,
  Building,
  Car,
  CreditCard,
  Globe,
  MapPin,
  Tag,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useCreateVisitorMutation } from "../api/visitorsApi";
import { CreateVisitorInput } from "../schemas/visitorsSchema";

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createMutation = useCreateVisitorMutation();

  const [plateNumber, setPlateNumber] = useState("");
  const [type, setType] = useState("car");
  const [memberId, setMemberId] = useState<number>(0);
  const [idCard, setIdCard] = useState("");
  const [thaiName, setThaiName] = useState("");
  const [engName, setEngName] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!plateNumber.trim()) {
      setErrorMsg("Plate Number is required.");
      return;
    }

    const payload: CreateVisitorInput = {
      plateNumber: plateNumber.trim(),
      type,
      memberId: Number(memberId) || 0,
      idCard: idCard.trim(),
      thaiName: thaiName.trim(),
      engName: engName.trim(),
      gender,
      address: address.trim(),
    };

    try {
      await createMutation.mutateAsync(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to register visitor entry.",
      );
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400'>
              <Car className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-100'>
                Register Visitor Entry
              </h2>
              <p className='text-xs text-slate-400'>
                Log incoming vehicle plate & visitor identity
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[80vh] overflow-y-auto'>
          {errorMsg && (
            <div className='p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5'>
              <AlertCircle className='w-4 h-4 text-red-400 shrink-0' />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Plate Number & Vehicle Type */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Plate Number <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Car className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder='e.g., 4ฒฉ6535'
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Vehicle Type
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Tag className='w-4 h-4' />
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 text-sm transition-colors appearance-none'
                >
                  <option value='car'>Car (รถยนต์)</option>
                  <option value='taxi'>Taxi (แท็กซี่)</option>
                  <option value='motorcycle'>Motorcycle (มอเตอร์ไซค์)</option>
                  <option value='transport'>Transport (ขนส่ง/ส่งของ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Member Unit ID */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Visited Member Unit ID
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                <Building className='w-4 h-4' />
              </div>
              <input
                type='number'
                value={memberId || ""}
                onChange={(e) => setMemberId(Number(e.target.value))}
                placeholder='Member ID (e.g., 779)'
                className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
              />
            </div>
          </div>

          {/* Visitor Thai Name & Eng Name */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Visitor Thai Name
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <User className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={thaiName}
                  onChange={(e) => setThaiName(e.target.value)}
                  placeholder='e.g., สมชาย ใจดี'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                English Name
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Globe className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={engName}
                  onChange={(e) => setEngName(e.target.value)}
                  placeholder='e.g., Somchai Jaidee'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* ID Card & Gender */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                ID Card Number
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <CreditCard className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  placeholder='13-digit ID number'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 text-sm transition-colors appearance-none'
              >
                <option value='ชาย'>ชาย (Male)</option>
                <option value='หญิง'>หญิง (Female)</option>
                <option value='อื่นๆ'>อื่นๆ (Other)</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Visitor Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-slate-500'>
                <MapPin className='w-4 h-4' />
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Visitor address'
                rows={2}
                className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors resize-none'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Entry</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

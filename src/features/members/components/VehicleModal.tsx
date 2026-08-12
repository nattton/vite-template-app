import { AlertCircle, Car, MapPin, Phone, Shield, Tag, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} from "../api/membersApi";
import { CreateVehicleInput, Vehicle } from "../schemas/membersSchema";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  vehicleToEdit?: Vehicle | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  memberId,
  vehicleToEdit,
}) => {
  const createMutation = useCreateVehicleMutation();
  const updateMutation = useUpdateVehicleMutation(memberId);

  const [plateNumber, setPlateNumber] = useState("");
  const [plateProvince, setPlateProvince] = useState("กทม");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [telephone, setTelephone] = useState("");
  const [resemble, setResemble] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (vehicleToEdit) {
      setPlateNumber(vehicleToEdit.plateNumber || "");
      setPlateProvince(vehicleToEdit.plateProvince || "กทม");
      setBrand(vehicleToEdit.brand || "");
      setColor(vehicleToEdit.color || "");
      setTelephone(vehicleToEdit.telephone || "");
      setResemble(vehicleToEdit.resemble || "");
    } else {
      setPlateNumber("");
      setPlateProvince("กทม");
      setBrand("");
      setColor("");
      setTelephone("");
      setResemble("");
    }
    setErrorMsg(null);
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!plateNumber.trim()) {
      setErrorMsg("Plate Number is required.");
      return;
    }

    const payload: CreateVehicleInput = {
      plateNumber: plateNumber.trim(),
      plateProvince: plateProvince.trim(),
      brand: brand.trim(),
      color: color.trim(),
      telephone: telephone.trim(),
      resemble: resemble.trim(),
    };

    try {
      if (vehicleToEdit) {
        await updateMutation.mutateAsync({
          id: vehicleToEdit.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync({
          memberId,
          data: payload,
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to save vehicle details.",
      );
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'>
              <Car className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-100'>
                {vehicleToEdit ? "Edit Vehicle" : "Add Vehicle to Member"}
              </h2>
              <p className='text-xs text-slate-400'>
                {vehicleToEdit
                  ? `Updating plate ${vehicleToEdit.plateNumber}`
                  : `Assign a new vehicle to Member #${memberId}`}
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
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {errorMsg && (
            <div className='p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5'>
              <AlertCircle className='w-4 h-4 text-red-400 shrink-0' />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Plate Number & Province */}
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
                  placeholder='e.g., 1กก3888'
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Province
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <MapPin className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={plateProvince}
                  onChange={(e) => setPlateProvince(e.target.value)}
                  placeholder='e.g., กทม'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* Brand & Color */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Brand / Make
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Shield className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder='e.g., TOYOTA, BENZ'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Color
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Tag className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder='e.g., สีขาว, สีดำ'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* Telephone & Resemble */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Vehicle Contact Phone
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Phone className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder='e.g., 086-4156668'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Resemble / Notes
              </label>
              <input
                type='text'
                value={resemble}
                onChange={(e) => setResemble(e.target.value)}
                placeholder='Optional notes'
                className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
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
              className='px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{vehicleToEdit ? "Update Vehicle" : "Add Vehicle"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

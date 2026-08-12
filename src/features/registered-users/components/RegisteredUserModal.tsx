import {
  AlertCircle,
  Calendar,
  CreditCard,
  Globe,
  MapPin,
  Phone,
  Tag,
  User,
  UserCheck,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useCreateRegisteredUserMutation,
  useUpdateRegisteredUserMutation,
} from "../api/registeredUsersApi";
import {
  CreateRegisteredUserInput,
  RegisteredUser,
} from "../schemas/registeredUsersSchema";

interface RegisteredUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: RegisteredUser | null;
}

export const RegisteredUserModal: React.FC<RegisteredUserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {
  const createMutation = useCreateRegisteredUserMutation();
  const updateMutation = useUpdateRegisteredUserMutation();

  const [thaiName, setThaiName] = useState("");
  const [engName, setEngName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [type, setType] = useState("ขนส่ง");
  const [telephone, setTelephone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [address, setAddress] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setThaiName(userToEdit.thaiName || "");
      setEngName(userToEdit.engName || "");
      setIdCard(userToEdit.idCard || "");
      setType(userToEdit.type || "ขนส่ง");
      setTelephone(userToEdit.telephone || "");
      setBirthdate(userToEdit.birthdate || "");
      setGender(userToEdit.gender || "ชาย");
      setAddress(userToEdit.address || "");
      // format expiredDate to YYYY-MM-DD if ISO string
      let exp = userToEdit.expiredDate || "";
      if (exp.includes("T")) {
        exp = exp.split("T")[0];
      }
      setExpiredDate(exp);
    } else {
      setThaiName("");
      setEngName("");
      setIdCard("");
      setType("ขนส่ง");
      setTelephone("");
      setBirthdate("");
      setGender("ชาย");
      setAddress("");
      // Default expiredDate to end of year or 1 year from today
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiredDate(nextYear.toISOString().split("T")[0]);
    }
    setErrorMsg(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!thaiName.trim()) {
      setErrorMsg("Thai Name is required.");
      return;
    }
    if (
      !idCard.trim() ||
      idCard.trim().length < 7 ||
      idCard.trim().length > 13
    ) {
      setErrorMsg("ID Card must be between 7 and 13 characters.");
      return;
    }
    if (!expiredDate.trim()) {
      setErrorMsg("Expired Date (YYYY-MM-DD) is required.");
      return;
    }

    const payload: CreateRegisteredUserInput = {
      thaiName: thaiName.trim(),
      engName: engName.trim(),
      idCard: idCard.trim(),
      type: type.trim(),
      telephone: telephone.trim(),
      birthdate: birthdate.trim(),
      gender,
      address: address.trim(),
      expiredDate: expiredDate.trim(),
    };

    try {
      if (userToEdit) {
        await updateMutation.mutateAsync({
          id: userToEdit.id,
          data: {
            ...payload,
            id: userToEdit.id,
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save registered user data.",
      );
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'>
              <UserCheck className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-100'>
                {userToEdit ? "Edit Registered User" : "Add Registered User"}
              </h2>
              <p className='text-xs text-slate-400'>
                {userToEdit
                  ? `Updating #${userToEdit.id} (${userToEdit.thaiName})`
                  : "Register a new verified identity for gate access"}
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
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-4 max-h-[80vh] overflow-y-auto'
        >
          {errorMsg && (
            <div className='p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5'>
              <AlertCircle className='w-4 h-4 text-red-400 shrink-0' />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Thai Name & English Name */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Thai Name <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <User className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={thaiName}
                  onChange={(e) => setThaiName(e.target.value)}
                  placeholder='e.g., นายเดชาพล กล้าหาญ'
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
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
                  placeholder='e.g., Dechaphol Klahan'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* ID Card & Type */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                ID Card Number <span className='text-red-400'>*</span>
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
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Registration Type <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Tag className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder='e.g., ขนส่ง, ลูกบ้าน, คนขับรถ'
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* Telephone & Gender */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Telephone
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Phone className='w-4 h-4' />
                </div>
                <input
                  type='text'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder='e.g., 0820685704'
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
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
                className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 text-sm transition-colors appearance-none'
              >
                <option value='ชาย'>ชาย (Male)</option>
                <option value='หญิง'>หญิง (Female)</option>
                <option value='อื่นๆ'>อื่นๆ (Other)</option>
              </select>
            </div>
          </div>

          {/* Birthdate & Expired Date */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Birthdate
              </label>
              <input
                type='text'
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder='e.g., 3 ม.ค. 2536'
                className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Expired Date <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Calendar className='w-4 h-4' />
                </div>
                <input
                  type='date'
                  value={expiredDate}
                  onChange={(e) => setExpiredDate(e.target.value)}
                  required
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 text-sm transition-colors'
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-slate-500'>
                <MapPin className='w-4 h-4' />
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Full residential address'
                rows={2}
                className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors resize-none'
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
              className='px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <span>
                  {userToEdit ? "Update User" : "Create Registered User"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { AlertCircle, Building, Phone, Tag, UserCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useCreateMemberMutation,
  useUpdateMemberMutation,
} from "../api/membersApi";
import { CreateMemberInput, Member } from "../schemas/membersSchema";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const createMutation = useCreateMemberMutation();
  const updateMutation = useUpdateMemberMutation();

  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("resident");
  const [status, setStatus] = useState("active");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || "");
      setTelephone(memberToEdit.telephone || "");
      setAddress(memberToEdit.address || "");
      setType(memberToEdit.type || "resident");
      setStatus(memberToEdit.status || "active");
    } else {
      setName("");
      setTelephone("");
      setAddress("");
      setType("resident");
      setStatus("active");
    }
    setErrorMsg(null);
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Name / House Unit is required.");
      return;
    }

    const payload: CreateMemberInput = {
      name: name.trim(),
      telephone: telephone.trim(),
      address: address.trim(),
      type,
      status,
    };

    try {
      if (memberToEdit) {
        await updateMutation.mutateAsync({
          id: memberToEdit.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to save member information.",
      );
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'>
              <UserCheck className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-100'>
                {memberToEdit ? "Edit Member" : "Create New Member"}
              </h2>
              <p className='text-xs text-slate-400'>
                {memberToEdit
                  ? `Update details for unit ${memberToEdit.name}`
                  : "Add a new resident or member unit"}
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

          {/* Name / Unit */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Name / House Unit <span className='text-red-400'>*</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                <Building className='w-4 h-4' />
              </div>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., 123/0001'
                required
                className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
              />
            </div>
          </div>

          {/* Telephone */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Telephone Number
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                <Phone className='w-4 h-4' />
              </div>
              <input
                type='text'
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder='e.g., 086-1234567'
                className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors'
              />
            </div>
          </div>

          {/* Type & Status Grid */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Type */}
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Member Type
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
                  <Tag className='w-4 h-4' />
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 text-sm transition-colors appearance-none'
                >
                  <option value='resident'>Resident</option>
                  <option value='residents'>Residents</option>
                  <option value='subcontractor'>Subcontractor</option>
                  <option value='carrier'>Carrier</option>
                  <option value='visitor'>Visitor</option>
                  <option value='vip'>VIP</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 text-sm transition-colors appearance-none'
              >
                <option value='active'>Active</option>
                <option value='overdue'>Overdue</option>
                <option value='inactive'>Inactive</option>
                <option value='suspended'>Suspended</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
              Address / Notes
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Optional address or notes'
              rows={2}
              className='w-full px-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-colors resize-none'
            />
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
              className='px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{memberToEdit ? "Update Member" : "Create Member"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

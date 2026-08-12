import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CreditCard,
  Edit2,
  Globe,
  MapPin,
  Phone,
  QrCode,
  ShieldCheck,
  Tag,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import React, { useRef, useState } from "react";
import {
  useDeleteRegisteredUserMutation,
  useUploadRegisteredUserPhotoMutation,
} from "../api/registeredUsersApi";
import { RegisteredUser } from "../schemas/registeredUsersSchema";
import { RegisteredUserModal } from "./RegisteredUserModal";
import { RegisteredUserQrModal } from "./RegisteredUserQrModal";

interface RegisteredUserDetailCardProps {
  user: RegisteredUser;
}

export const RegisteredUserDetailCard: React.FC<
  RegisteredUserDetailCardProps
> = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteMutation = useDeleteRegisteredUserMutation();
  const uploadPhotoMutation = useUploadRegisteredUserPhotoMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete registered user "${user.thaiName || user.idCard}"?`,
      )
    ) {
      await deleteMutation.mutateAsync(user.id);
      navigate({ to: "/registered-users" });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      await uploadPhotoMutation.mutateAsync({
        id: user.id,
        file,
      });
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload photo",
      );
    }
  };

  // Photo URL resolver
  const photoUrl = user.photo
    ? user.photo.startsWith("http")
      ? user.photo
      : `http://localhost:4000/anpr_store${user.photo}`
    : null;

  // Expiration helper
  const getExpirationStatus = (dateStr?: string) => {
    if (!dateStr)
      return {
        label: "No Expiration Date",
        style: "bg-slate-800 text-slate-400 border-slate-700",
      };

    const expDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );

    if (diffDays < 0) {
      return {
        label: "Expired Access",
        style: "bg-red-500/10 text-red-400 border-red-500/30",
      };
    }
    if (diffDays <= 14) {
      return {
        label: `Expires in ${diffDays} days`,
        style: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: "Active Access Clearance",
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    };
  };

  const expStatus = getExpirationStatus(user.expiredDate);

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      {/* Back Link */}
      <div>
        <Link
          to='/registered-users'
          className='inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Back to Registered Users Directory</span>
        </Link>
      </div>

      {/* Main Hero Card */}
      <div className='p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80'>
          {/* User Photo & Main Names */}
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left'>
            <div className='relative group shrink-0'>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={user.thaiName}
                  className='w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-xl bg-slate-950'
                />
              ) : (
                <div className='w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-3xl shadow-inner'>
                  <UserCheck className='w-12 h-12' />
                </div>
              )}

              {/* Upload Photo Button Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhotoMutation.isPending}
                className='absolute inset-0 rounded-2xl bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-semibold text-white gap-1 backdrop-blur-xs'
                title='Upload new photo'
              >
                <Camera className='w-5 h-5 text-emerald-400' />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3'>
                <h1 className='text-3xl font-extrabold text-white tracking-tight'>
                  {user.thaiName || "Unnamed Identity"}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${expStatus.style}`}
                >
                  {expStatus.label}
                </span>
              </div>

              {user.engName && (
                <p className='text-sm font-medium text-slate-300 flex items-center justify-center sm:justify-start gap-2'>
                  <Globe className='w-4 h-4 text-slate-500' />
                  <span>{user.engName}</span>
                </p>
              )}

              <p className='text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2 pt-1'>
                <span className='px-2.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-semibold uppercase tracking-wider border border-slate-700'>
                  {user.type || "Standard"}
                </span>
                <span>•</span>
                <span className='font-mono text-slate-500'>ID #{user.id}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap items-center justify-center sm:justify-end gap-3'>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className='px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2'
            >
              <QrCode className='w-4 h-4' />
              <span>QR Access Pass</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className='px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center gap-2'
            >
              <Edit2 className='w-4 h-4' />
              <span>Edit Details</span>
            </button>
            <button
              onClick={handleDelete}
              className='px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold transition-colors flex items-center gap-2'
            >
              <Trash2 className='w-4 h-4' />
              <span>Delete User</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className='p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2'>
            <span>{uploadError}</span>
          </div>
        )}

        {/* Detailed Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* ID Card */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <CreditCard className='w-4 h-4 text-emerald-400' />
              <span>ID Card Number</span>
            </div>
            <p className='text-lg font-mono font-bold text-slate-100'>
              {user.idCard || "Not specified"}
            </p>
          </div>

          {/* Telephone */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Phone className='w-4 h-4 text-emerald-400' />
              <span>Telephone</span>
            </div>
            <p className='text-base font-semibold text-slate-200'>
              {user.telephone || "No phone recorded"}
            </p>
          </div>

          {/* Category Type */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Tag className='w-4 h-4 text-emerald-400' />
              <span>Registration Type</span>
            </div>
            <p className='text-base font-semibold text-emerald-400 uppercase'>
              {user.type || "Default"}
            </p>
          </div>

          {/* Gender & Birthdate */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <User className='w-4 h-4 text-emerald-400' />
              <span>Gender / Birthdate</span>
            </div>
            <p className='text-sm font-medium text-slate-200'>
              {user.gender || "Unspecified"}{" "}
              {user.birthdate ? `(${user.birthdate})` : ""}
            </p>
          </div>

          {/* Expiration Date */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <Calendar className='w-4 h-4 text-emerald-400' />
              <span>Expiration Date</span>
            </div>
            <p className='text-base font-mono font-semibold text-slate-100'>
              {user.expiredDate ? user.expiredDate.split("T")[0] : "Indefinite"}
            </p>
          </div>

          {/* Generated UUID */}
          <div className='p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <ShieldCheck className='w-4 h-4 text-emerald-400' />
              <span>System Generated UUID</span>
            </div>
            <p
              className='text-xs font-mono text-slate-400 truncate'
              title={user.generatedId}
            >
              {user.generatedId || "—"}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className='p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
            <MapPin className='w-4 h-4 text-emerald-400' />
            <span>Address Details</span>
          </div>
          <p className='text-slate-200 font-medium text-sm leading-relaxed'>
            {user.address || "No residential address provided."}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <RegisteredUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={user}
      />

      {/* QR Code Pass Modal */}
      <RegisteredUserQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        user={user}
      />
    </div>
  );
};

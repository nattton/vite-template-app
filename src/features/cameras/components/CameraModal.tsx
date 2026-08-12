import {
  Camera,
  UpdateCameraInput,
} from "../schemas/camerasSchema";
import { useUpdateCameraMutation } from "../api/camerasApi";
import { AlertCircle, Camera as CameraIcon, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: Camera | null;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  camera,
}) => {
  const [form, setForm] = useState<UpdateCameraInput>({
    ipAddress: "",
    port: "554",
    username: "admin",
    password: "",
    path: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useUpdateCameraMutation();

  useEffect(() => {
    if (camera) {
      setForm({
        ipAddress: camera.ipAddress || "",
        port: camera.port || "554",
        username: camera.username || "admin",
        password: camera.password || "",
        path: camera.path || "",
      });
      setErrorMessage(null);
    }
  }, [camera]);

  if (!isOpen || !camera) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        id: camera.id,
        data: form,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to update camera configuration",
      );
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150'>
      <div className='bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150'>
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-slate-800 pb-4'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'>
              <CameraIcon className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-100'>
                Configure Camera #{camera.id}: {camera.name}
              </h2>
              <p className='text-xs text-slate-400'>
                Update RTSP IP address, port, and authentication credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className='flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium'>
            <AlertCircle className='w-4 h-4 shrink-0' />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4 text-sm'>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
              IP Address <span className='text-rose-400'>*</span>
            </label>
            <input
              type='text'
              required
              value={form.ipAddress}
              onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
              placeholder='e.g. 192.168.1.65'
              className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-colors'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                RTSP Port
              </label>
              <input
                type='text'
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
                placeholder='554'
                className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-colors'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                Username
              </label>
              <input
                type='text'
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder='admin'
                className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-colors'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
              Password
            </label>
            <input
              type='password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder='••••••••'
              className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-colors'
            />
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
              Stream Path <span className='text-slate-500 font-normal lowercase'>(optional)</span>
            </label>
            <input
              type='text'
              value={form.path}
              onChange={(e) => setForm({ ...form, path: e.target.value })}
              placeholder='/Streaming/Channels/102'
              className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-colors'
            />
          </div>

          {/* RTSP Stream URL Preview */}
          <div className='p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1'>
            <span className='text-[11px] font-semibold text-slate-400 uppercase tracking-wider'>
              Generated RTSP URL Preview:
            </span>
            <p className='text-xs font-mono text-cyan-400 break-all'>
              rtsp://{form.username || "admin"}:***@{form.ipAddress || "0.0.0.0"}
              :{form.port || "554"}
              {form.path}
            </p>
          </div>

          {/* Modal Actions */}
          <div className='flex justify-end gap-3 pt-4 border-t border-slate-800'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updateMutation.isPending}
              className='inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20'
            >
              {updateMutation.isPending && (
                <Loader2 className='w-4 h-4 animate-spin' />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

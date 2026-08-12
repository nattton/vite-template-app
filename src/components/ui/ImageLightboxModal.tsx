import { Camera, X } from "lucide-react";
import React from "react";

export interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200'>
      <div className='relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6'>
        <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
          <h3 className='text-base font-bold text-slate-100 flex items-center gap-2'>
            <Camera className='w-5 h-5 text-cyan-400' />
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className='p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='flex justify-center items-center bg-slate-950 rounded-2xl overflow-hidden p-2 min-h-[300px] border border-slate-800/80'>
          <img
            src={imageUrl}
            alt={title}
            className='max-h-[70vh] w-auto object-contain rounded-xl shadow-lg'
          />
        </div>
      </div>
    </div>
  );
};

import { Pagination } from "@/components/ui/Pagination";
import { useClientTable } from "@/hooks/useClientTable";
import {
  Check,
  Copy,
  Edit2,
  Globe,
  Key,
  Lock,
  RotateCw,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { Camera } from "../schemas/camerasSchema";
import { CameraModal } from "./CameraModal";

interface CameraListTableProps {
  cameras: Camera[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CameraListTable: React.FC<CameraListTableProps> = ({
  cameras,
  onRefresh,
  isRefreshing = false,
}) => {
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<number, boolean>>({});

  const {
    searchTerm,
    currentPage,
    pageSize,
    filteredData: filteredCameras,
    paginatedData: paginatedCameras,
    handleSearchChange,
    handlePageChange: setCurrentPage,
    handlePageSizeChange: setPageSize,
  } = useClientTable({
    data: cameras,
    filterFn: (item, term) => {
      const searchLower = term.toLowerCase().trim();
      if (!searchLower) return true;

      const matchName = item.name.toLowerCase().includes(searchLower);
      const matchIp = item.ipAddress.toLowerCase().includes(searchLower);
      const matchPath = item.path.toLowerCase().includes(searchLower);
      const matchPort = item.port.toLowerCase().includes(searchLower);

      return matchName || matchIp || matchPath || matchPort;
    },
    defaultPageSize: 50,
  });

  const toggleShowPassword = (id: number) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyRtspUrl = (cam: Camera) => {
    const url = `rtsp://${cam.username}:${cam.password}@${cam.ipAddress}:${cam.port}${cam.path}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cam.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className='space-y-6'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldCheck className='w-3.5 h-3.5' /> CCTV & ANPR Hardware Registry
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            IP Camera Management
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Configure gate cameras, ANPR stream URLs, IP addresses, and RTSP video endpoints.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-cyan-400 font-semibold text-sm transition-all border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg shadow-cyan-500/10 shrink-0 self-start sm:self-center'
            title='Refresh Camera Configurations'
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Cameras"}</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search camera name (ENTRANCE, EXIT...), IP address, RTSP path...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>
      </div>

      {/* Main Table */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>ID</th>
                <th className='px-6 py-4'>Camera Name</th>
                <th className='px-6 py-4'>Network Address</th>
                <th className='px-6 py-4'>Port</th>
                <th className='px-6 py-4'>Auth Credentials</th>
                <th className='px-6 py-4'>RTSP Stream Endpoint</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {paginatedCameras.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No camera channels found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedCameras.map((cam) => {
                  const isPasswordVisible = Boolean(showPasswordMap[cam.id]);

                  return (
                    <tr
                      key={cam.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      {/* ID */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{cam.id}
                      </td>

                      {/* Camera Name */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2.5'>
                          <div className='p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0'>
                            <Video className='w-4 h-4' />
                          </div>
                          <div>
                            <span className='font-bold text-slate-100 uppercase tracking-wider text-sm'>
                              {cam.name}
                            </span>
                            <span className='block text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5'>
                              <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                              Online Channel
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className='px-6 py-4 font-mono text-sm text-cyan-300'>
                        <div className='flex items-center gap-1.5'>
                          <Globe className='w-3.5 h-3.5 text-slate-500' />
                          <span>{cam.ipAddress || "0.0.0.0"}</span>
                        </div>
                      </td>

                      {/* Port */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-300'>
                        <span className='px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700'>
                          {cam.port || "554"}
                        </span>
                      </td>

                      {/* Username / Password */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-300'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-1.5 text-slate-400'>
                            <Key className='w-3 h-3 text-slate-500' />
                            <span>{cam.username || "admin"}</span>
                          </div>
                          <div className='flex items-center gap-1.5 text-slate-500'>
                            <Lock className='w-3 h-3 text-slate-500' />
                            <span>
                              {isPasswordVisible
                                ? cam.password || "(empty)"
                                : "••••••••"}
                            </span>
                            <button
                              onClick={() => toggleShowPassword(cam.id)}
                              className='text-[10px] underline text-cyan-400 hover:text-cyan-300 ml-1'
                            >
                              {isPasswordVisible ? "hide" : "show"}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* RTSP Path */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-400 max-w-xs truncate'>
                        <span className='text-slate-300'>
                          {cam.path || "/"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => copyRtspUrl(cam)}
                            className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors border border-slate-700'
                            title='Copy RTSP Stream URL'
                          >
                            {copiedId === cam.id ? (
                              <Check className='w-4 h-4 text-emerald-400' />
                            ) : (
                              <Copy className='w-4 h-4' />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingCamera(cam)}
                            className='p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors'
                            title='Configure Camera Settings'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={cameras.length}
          filteredCount={filteredCameras.length}
          showingCount={paginatedCameras.length}
          itemLabel='cameras'
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Edit Camera Modal */}
      <CameraModal
        isOpen={Boolean(editingCamera)}
        onClose={() => setEditingCamera(null)}
        camera={editingCamera}
      />
    </div>
  );
};

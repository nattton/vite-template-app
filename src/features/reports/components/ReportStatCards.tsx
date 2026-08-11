import { Activity, Car, Crown, TrendingUp } from "lucide-react";
import React from "react";
import { TrafficReportItem } from "../types/reports";

interface ReportStatCardsProps {
  data: TrafficReportItem[];
}

export const ReportStatCards: React.FC<ReportStatCardsProps> = ({ data }) => {
  const totalTraffic = data.reduce((sum, item) => sum + item.traffic, 0);
  const totalRecords = data.length;
  const avgTraffic =
    totalRecords > 0 ? (totalTraffic / totalRecords).toFixed(1) : "0";

  const topRecord =
    data.length > 0
      ? data.reduce(
          (max, item) => (item.traffic > max.traffic ? item : max),
          data[0],
        )
      : null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Total Traffic Volume */}
      <div className='p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
            Total Traffic Volume
          </p>
          <p className='text-2xl font-extrabold text-white'>
            {totalTraffic.toLocaleString()}
          </p>
          <p className='text-[11px] text-slate-500'>Total entries / exits</p>
        </div>
        <div className='w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
          <TrendingUp className='w-6 h-6' />
        </div>
      </div>

      {/* Unique Vehicles */}
      <div className='p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
            Total Vehicles
          </p>
          <p className='text-2xl font-extrabold text-cyan-400'>
            {totalRecords.toLocaleString()}
          </p>
          <p className='text-[11px] text-slate-500'>Reported vehicles</p>
        </div>
        <div className='w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400'>
          <Car className='w-6 h-6' />
        </div>
      </div>

      {/* Peak Traffic */}
      <div className='p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
            Top Traffic Record
          </p>
          <p className='text-2xl font-extrabold text-amber-400'>
            {topRecord ? topRecord.traffic.toLocaleString() : "0"}
          </p>

          <p className='text-[11px] text-amber-300/80 font-mono truncate max-w-[130px]'>
            {topRecord
              ? `${topRecord.name} (${topRecord.plateNumber})`
              : "N/A"}
          </p>
        </div>
        <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400'>
          <Crown className='w-6 h-6' />
        </div>
      </div>

      {/* Avg Traffic */}
      <div className='p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg backdrop-blur-md flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
            Avg Traffic / Vehicle
          </p>
          <p className='text-2xl font-extrabold text-emerald-400'>
            {avgTraffic}
          </p>
          <p className='text-[11px] text-slate-500'>Per registered vehicle</p>
        </div>
        <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
          <Activity className='w-6 h-6' />
        </div>
      </div>
    </div>
  );
};

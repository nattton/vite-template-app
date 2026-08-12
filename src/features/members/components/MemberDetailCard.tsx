import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building,
  Car,
  Edit2,
  MapPin,
  Phone,
  Plus,
  Shield,
  Tag,
  Trash2
} from "lucide-react";
import React, { useState } from "react";
import {
  useDeleteMemberMutation,
  useDeleteVehicleMutation,
} from "../api/membersApi";
import { Member, Vehicle } from "../schemas/membersSchema";
import { MemberModal } from "./MemberModal";
import { VehicleModal } from "./VehicleModal";

interface MemberDetailCardProps {
  member: Member;
}

export const MemberDetailCard: React.FC<MemberDetailCardProps> = ({
  member,
}) => {
  const navigate = useNavigate();
  const deleteMemberMutation = useDeleteMemberMutation();
  const deleteVehicleMutation = useDeleteVehicleMutation(member.id);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  const handleDeleteMember = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete member unit "${member.name}"? This will also remove associated vehicles.`,
      )
    ) {
      await deleteMemberMutation.mutateAsync(member.id);
      navigate({ to: "/members" });
    }
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (
      window.confirm(
        `Are you sure you want to remove vehicle plate "${vehicle.plateNumber}"?`,
      )
    ) {
      await deleteVehicleMutation.mutateAsync(vehicle.id);
    }
  };

  const handleOpenAddVehicle = () => {
    setVehicleToEdit(null);
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsVehicleModalOpen(true);
  };

  return (
    <div className='space-y-8 max-w-6xl mx-auto'>
      {/* Top Navigation */}
      <div>
        <Link
          to='/members'
          className='inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Back to Members Directory</span>
        </Link>
      </div>

      {/* Main Member Hero Card */}
      <div className='p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80'>
          <div className='flex items-start gap-4'>
            <div className='p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-inner'>
              <Building className='w-8 h-8' />
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <h1 className='text-3xl font-extrabold text-white tracking-tight'>
                  Unit {member.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    member.status?.toLowerCase() === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : member.status?.toLowerCase() === "overdue"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : member.status?.toLowerCase() === "suspended"
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {member.status || "active"}
                </span>
              </div>
              <p className='text-sm text-slate-400 flex items-center gap-2'>
                <span className='font-mono text-slate-500'>
                  ID: #{member.id}
                </span>
                <span>•</span>
                <span className='uppercase font-semibold text-slate-300'>
                  Type: {member.type || "resident"}
                </span>
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className='px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center gap-2'
            >
              <Edit2 className='w-4 h-4' />
              <span>Edit Member</span>
            </button>
            <button
              onClick={handleDeleteMember}
              className='px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold transition-colors flex items-center gap-2'
            >
              <Trash2 className='w-4 h-4' />
              <span>Delete Unit</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-2'>
          <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
              <Phone className='w-3.5 h-3.5 text-indigo-400' />
              <span>Telephone</span>
            </div>
            <p className='text-slate-200 font-medium text-sm'>
              {member.telephone || "Not provided"}
            </p>
          </div>

          <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
              <MapPin className='w-3.5 h-3.5 text-indigo-400' />
              <span>Address</span>
            </div>
            <p className='text-slate-200 font-medium text-sm'>
              {member.address || "No address details specified"}
            </p>
          </div>

          <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
              <Car className='w-3.5 h-3.5 text-indigo-400' />
              <span>Registered Vehicles</span>
            </div>
            <p className='text-slate-200 font-medium text-sm'>
              {member.vehicles?.length || 0} vehicle(s) on file
            </p>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'>
              <Car className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-white'>Vehicles List</h2>
              <p className='text-xs text-slate-400'>
                Registered license plates for gate ANPR recognition
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddVehicle}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20'
          >
            <Plus className='w-4 h-4' />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Vehicles Grid / Table */}
        {!member.vehicles || member.vehicles.length === 0 ? (
          <div className='p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 space-y-3'>
            <Car className='w-12 h-12 text-slate-600 mx-auto' />
            <p className='font-medium text-slate-400'>
              No vehicles registered to this member unit.
            </p>
            <button
              onClick={handleOpenAddVehicle}
              className='px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors'
            >
              + Add First Vehicle
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {member.vehicles.map((v: Vehicle) => (
              <div
                key={v.id}
                className='p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4 group'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className='px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-lg text-cyan-300 tracking-wider shadow-inner'>
                        {v.plateNumber}
                      </span>
                      {v.plateProvince && (
                        <span className='text-xs font-semibold text-slate-400 bg-slate-800/60 px-2 py-1 rounded'>
                          {v.plateProvince}
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-slate-400 flex items-center gap-2 pt-1'>
                      <Shield className='w-3.5 h-3.5 text-slate-500' />
                      <span className='font-semibold text-slate-200'>
                        {v.brand || "Unknown Brand"}
                      </span>
                      <span>•</span>
                      <Tag className='w-3.5 h-3.5 text-slate-500' />
                      <span>{v.color || "Standard Color"}</span>
                    </p>
                  </div>

                  <div className='flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => handleOpenEditVehicle(v)}
                      className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors'
                      title='Edit vehicle'
                    >
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v)}
                      className='p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors'
                      title='Delete vehicle'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  </div>
                </div>

                {(v.telephone || v.resemble) && (
                  <div className='pt-3 border-t border-slate-800/60 text-xs text-slate-400 space-y-1'>
                    {v.telephone && (
                      <p className='flex items-center gap-2'>
                        <Phone className='w-3.5 h-3.5 text-slate-500' />
                        <span>Phone: {v.telephone}</span>
                      </p>
                    )}
                    {v.resemble && (
                      <p className='text-slate-500 italic'>
                        Note: {v.resemble}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={member}
      />

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        memberId={member.id}
        vehicleToEdit={vehicleToEdit}
      />
    </div>
  );
};

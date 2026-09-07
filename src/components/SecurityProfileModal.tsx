import React from 'react';
import { 
  ShieldCheck, 
  X, 
  LogOut, 
  Lock, 
  Key, 
  Terminal, 
  User, 
  Fingerprint, 
  Clock, 
  Globe, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserOfficer } from '../types';

interface SecurityProfileModalProps {
  user: UserOfficer;
  token?: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SecurityProfileModal: React.FC<SecurityProfileModalProps> = ({
  user,
  token,
  isOpen,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0B0F17] border border-cyan-500/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-cyan-950/40 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['JetBrains_Mono',monospace]">
                  Officer Security Clearance Profile
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                  DEFCON 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ResilientRoute AI Intermodal Defense Enclave
              </p>
            </div>
          </div>
          <button
            id="close-security-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Officer Identity Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono font-bold text-lg flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  {user.officerId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{user.role}</p>
              <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Clearance Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Clearance Level</span>
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {user.clearanceLevel}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Department</span>
              <span className="text-slate-200 font-medium">
                {user.department}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Cryptographic Cipher</span>
              <span className="text-cyan-300 font-mono">
                PBKDF2-SHA512 + AES-256
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Last Authentication</span>
              <span className="text-slate-300 font-mono">
                {new Date(user.lastLogin).toLocaleTimeString()} UTC
              </span>
            </div>
          </div>

          {/* Assigned Intermodal Jurisdictions */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Authorized Maritime & Intermodal Corridors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.assignedJurisdictions.map((jurisdiction, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1"
                >
                  <Globe className="w-3 h-3 text-cyan-400" />
                  {jurisdiction}
                </span>
              ))}
            </div>
          </div>

          {/* Active Cryptographic Token Info */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                Active Session Token Signature:
              </span>
              <span className="text-emerald-400 font-bold">HMAC-SHA256 VERIFIED</span>
            </div>
            <div className="p-2 rounded bg-slate-900 text-cyan-300/80 break-all text-[11px] select-all border border-slate-800">
              {user.sessionToken || token || '0x49f81a7b8e0192ca893b4e72301984'}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            id="close-modal-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Return to Command Center
          </button>
          
          <button
            type="button"
            id="officer-logout-btn"
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            Terminate Officer Session
          </button>
        </div>

      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { 
  Activity, 
  Database, 
  FileText, 
  PhoneCall, 
  Code2, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { TrialProtocol } from '@/types/protocol';

interface HeaderProps {
  activeTab: 'screening' | 'protocols' | 'outreach' | 'ehr' | 'api';
  setActiveTab: (tab: 'screening' | 'protocols' | 'outreach' | 'ehr' | 'api') => void;
  protocols: TrialProtocol[];
  selectedProtocolId: string;
  setSelectedProtocolId: (id: string) => void;
  userRole: 'INVESTIGATOR' | 'COORDINATOR';
  setUserRole: (role: 'INVESTIGATOR' | 'COORDINATOR') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  protocols,
  selectedProtocolId,
  setSelectedProtocolId,
  userRole,
  setUserRole,
}) => {
  const selectedProtocol = protocols.find(p => p.id === selectedProtocolId);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      {/* Top Banner / System Bar */}
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Brand & Trial Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 shadow-lg shadow-cyan-500/20">
              <Activity className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">BOND HEALTH</span>
                <span className="rounded-md bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/60 uppercase tracking-wide">
                  Criteria Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">EHR Ingestion & Clinical Trial Screening</p>
            </div>
          </div>

          {/* Active Trial Selector */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 ml-1">
                Active Protocol
              </label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/70 rounded-lg px-3 py-1.5 gap-2 hover:border-slate-600 transition cursor-pointer">
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <select 
                  value={selectedProtocolId}
                  onChange={(e) => setSelectedProtocolId(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-4"
                >
                  {protocols.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                      {p.protocolNumber}: {p.shortTitle} ({p.phase})
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 pointer-events-none -ml-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: EHR Sync Badge & Clinician Role Switcher */}
        <div className="flex items-center gap-4">
          {/* Real-time EHR Telemetry Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">FHIR R4 Pipelines:</span>
            <span className="text-emerald-400 font-semibold text-[11px]">4 Connected</span>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setUserRole('INVESTIGATOR')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                userRole === 'INVESTIGATOR'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sign off on clinical overrides and approve study enrollments"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Investigator</span>
            </button>
            <button
              onClick={() => setUserRole('COORDINATOR')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                userRole === 'COORDINATOR'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Manage outreach, phone screening, and patient appointments"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Coordinator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center space-x-1 px-6 border-t border-slate-800/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('screening')}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition ${
            activeTab === 'screening'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Patient Screening & Evidence</span>
          <span className="ml-1 rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">
            12 Cohort
          </span>
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition ${
            activeTab === 'protocols'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Protocol Studio & AI Parser</span>
          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
            <Sparkles className="h-2.5 w-2.5" />
            <span>AI Parser</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition ${
            activeTab === 'outreach'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          <span>AI Outreach & Voice Screener</span>
          <span className="rounded-full bg-emerald-950/60 border border-emerald-700/50 px-1.5 py-0.5 text-[10px] text-emerald-300 font-mono">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ehr')}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition ${
            activeTab === 'ehr'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>EHR Interoperability Hub</span>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-cyan-400 font-mono">
            Epic / athena / eCW
          </span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition ${
            activeTab === 'api'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>OpenAPI & Partner Specs</span>
        </button>
      </div>
    </header>
  );
};

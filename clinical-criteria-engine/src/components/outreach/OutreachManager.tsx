'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Send, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { TrialProtocol, PatientTrialEvaluation } from '@/types/protocol';
import { FHIRPatientRecord } from '@/types/fhir';
import { VoiceCallDialogue, OutreachStage } from '@/types/recruitment';

interface OutreachManagerProps {
  protocol: TrialProtocol;
  evaluations: PatientTrialEvaluation[];
  patientRecords: FHIRPatientRecord[];
  selectedPatientId?: string;
}

export const OutreachManager: React.FC<OutreachManagerProps> = ({
  protocol,
  evaluations,
  patientRecords,
  selectedPatientId: initialPatientId,
}) => {
  // Only evaluate eligible patients for outreach
  const eligibleEvals = evaluations.filter(e => e.overallStatus === 'ELIGIBLE');
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || (eligibleEvals[0]?.patientId || 'p-001')
  );

  const [activeMode, setActiveMode] = useState<'VOICE_AGENT' | 'SMS_GENERATOR'>('VOICE_AGENT');

  // Simulated Voice Call State
  const [callStatus, setCallStatus] = useState<'IDLE' | 'CONNECTING' | 'LIVE' | 'COMPLETED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // Simulated patient conversation script
  const conversationScript: VoiceCallDialogue[] = [
    {
      id: 'd-1',
      sender: 'ai_screener',
      text: `Hello, am I speaking with ${patientRecords.find(p => p.patient.id === selectedPatientId)?.patient.name[0]?.given[0] || 'the patient'}? My name is Maya, an AI Clinical Research Coordinator calling on behalf of Dr. Thorne at the Thoracic Oncology Center.`,
      timestamp: '00:04',
    },
    {
      id: 'd-2',
      sender: 'patient',
      text: "Yes, this is Eleanor. Is this regarding the new clinical trial for EGFR lung cancer?",
      timestamp: '00:10',
      sentiment: 'positive',
    },
    {
      id: 'd-3',
      sender: 'ai_screener',
      text: "That's exactly right! Based on your recent molecular pathology results showing the EGFR Exon 19 deletion, your oncologist flagged that you may be a candidate for the BOND-001 study with a novel targeted kinase inhibitor.",
      timestamp: '00:18',
    },
    {
      id: 'd-4',
      sender: 'patient',
      text: "That sounds very promising. What does the trial commitment look like in terms of hospital visits?",
      timestamp: '00:26',
      sentiment: 'neutral',
    },
    {
      id: 'd-5',
      sender: 'ai_screener',
      text: "The study protocol involves an outpatient clinic visit once every 3 weeks for lab draws and safety check-ins, with all study medications and travel stipends provided. Would you be able to attend visits on weekday mornings?",
      timestamp: '00:35',
      criteriaValidated: 'Clinic Visit Availability (Met)',
    },
    {
      id: 'd-6',
      sender: 'patient',
      text: "Yes, weekday mornings work well for me. My daughter can drive me to the center.",
      timestamp: '00:42',
      sentiment: 'positive',
    },
    {
      id: 'd-7',
      sender: 'ai_screener',
      text: "Wonderful. Our clinical team has reviewed your records and cleared your lab prerequisites. May I schedule a 30-minute in-person informed consent and screening appointment with Dr. Thorne's team for next Tuesday at 10:00 AM?",
      timestamp: '00:52',
    },
    {
      id: 'd-8',
      sender: 'patient',
      text: "Yes, next Tuesday at 10:00 AM is perfect. Please send the confirmation details to my email.",
      timestamp: '00:58',
      sentiment: 'positive',
      criteriaValidated: 'Informed Consent Willingness (Confirmed)',
    },
    {
      id: 'd-9',
      sender: 'ai_screener',
      text: "Confirmed! I have locked in your appointment for Tuesday at 10:00 AM via Cal.com and dispatched the patient information brochure to your email. Thank you, and take care!",
      timestamp: '01:05',
    }
  ];

  // Voice Call Timer & Dialogue Progression
  useEffect(() => {
    let interval: any;
    if (callStatus === 'LIVE') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    let timeout: any;
    if (callStatus === 'LIVE' && dialogueIndex < conversationScript.length - 1) {
      timeout = setTimeout(() => {
        setDialogueIndex(prev => prev + 1);
      }, 3500);
    } else if (callStatus === 'LIVE' && dialogueIndex >= conversationScript.length - 1) {
      timeout = setTimeout(() => {
        setCallStatus('COMPLETED');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [callStatus, dialogueIndex]);

  const handleStartCall = () => {
    setCallStatus('CONNECTING');
    setCallDuration(0);
    setDialogueIndex(0);
    setTimeout(() => {
      setCallStatus('LIVE');
    }, 1500);
  };

  const handleEndCall = () => {
    setCallStatus('COMPLETED');
  };

  const selectedPatientRec = patientRecords.find(p => p.patient.id === selectedPatientId);
  const selectedEval = evaluations.find(e => e.patientId === selectedPatientId);

  // Personalized AI Generated Outreach Message
  const generatedMessage = selectedPatientRec ? {
    subject: `Clinical Research Opportunity: Targeted Therapy Study for ${protocol.indication}`,
    body: `Dear ${selectedPatientRec.patient.name[0]?.given[0]} ${selectedPatientRec.patient.name[0]?.family},

Dr. Thorne and the thoracic oncology research team at Bond Health Network have reviewed your clinical records. Based on your recent diagnosis and documented EGFR sensitizing mutation (Exon 19 deletion), you may be eligible to participate in the ${protocol.shortTitle} (Protocol ${protocol.protocolNumber}).

This Phase III study evaluates a next-generation targeted kinase inhibitor designed to inhibit tumor growth with enhanced central nervous system penetration and manageable tolerability.

Key Highlights:
• All study medication, specialist consultations, and laboratory testing are provided at zero cost
• Flexible morning appointment schedule with full transportation stipend
• Close clinical monitoring by our dedicated oncology trial team

If you are interested in learning more or reviewing the informed consent brochure, please reply to this SMS or click the link below to book a 15-minute consultation:
https://cal.com/bond-health/clinical-screening?patient=${selectedPatientRec.patient.id}&trial=${protocol.id}

Warm regards,
Clinical Research Coordination Team
Bond Health Network | IRB Ref: IRB00054291`,
    rationale: `Grounded in patient's confirmed EGFR Exon 19 del (LOINC 48000-4) and adequate baseline ANC (${selectedPatientRec.observations.find(o => o.code.coding?.some(c => c.code === '26499-4'))?.valueQuantity?.value || '2,450'} /uL).`
  } : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Patient Outreach & Voice Screener</h2>
            <span className="text-xs bg-emerald-950 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ElevenLabs + Twilio Agent</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated, protocol-grounded patient engagement, eligibility pre-screening phone calls, and appointment scheduling
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveMode('VOICE_AGENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeMode === 'VOICE_AGENT' ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Interactive Voice Agent</span>
          </button>
          <button
            onClick={() => setActiveMode('SMS_GENERATOR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeMode === 'SMS_GENERATOR' ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>AI Outreach Drafter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Eligible Patient Candidate Queue */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Eligible Candidates ({eligibleEvals.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% Criteria Met</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {eligibleEvals.map((ev) => {
              const p = patientRecords.find(pr => pr.patient.id === ev.patientId);
              const isSelected = ev.patientId === selectedPatientId;

              return (
                <div
                  key={ev.patientId}
                  onClick={() => {
                    setSelectedPatientId(ev.patientId);
                    setCallStatus('IDLE');
                    setDialogueIndex(0);
                  }}
                  className={`rounded-xl p-3.5 border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{ev.patientName}</span>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      {ev.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>{ev.mrn}</span>
                    <span>{p?.ehrSource}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3 text-cyan-400" />
                    <span>{p?.patient.telecom?.[0]?.value || '+1 (555) 234-8901'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Voice Call Interactive Simulator OR SMS Drafter */}
        <div className="lg:col-span-2">
          {activeMode === 'VOICE_AGENT' ? (
            /* Voice Screening Interactive Simulator */
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl flex flex-col h-full min-h-[580px]">
              {/* Call Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    callStatus === 'LIVE' ? 'bg-emerald-600 shadow-lg shadow-emerald-600/30' : 'bg-slate-800'
                  }`}>
                    <PhoneCall className={`h-6 w-6 ${callStatus === 'LIVE' ? 'text-white animate-bounce' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {selectedPatientRec?.patient.name[0]?.given.join(' ')} {selectedPatientRec?.patient.name[0]?.family}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                      <span>{selectedPatientRec?.patient.telecom?.[0]?.value || '+1 (555) 234-8901'}</span>
                      <span>•</span>
                      <span className="text-cyan-400">ElevenLabs Conversational AI v2</span>
                    </div>
                  </div>
                </div>

                {/* Call Action Button */}
                <div>
                  {callStatus === 'IDLE' && (
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Initiate AI Screening Call</span>
                    </button>
                  )}
                  {callStatus === 'CONNECTING' && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                      <span>Dialing via Twilio SIP...</span>
                    </div>
                  )}
                  {callStatus === 'LIVE' && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800/80">
                        <Clock className="h-3.5 w-3.5" />
                        <span>00:{callDuration < 10 ? `0${callDuration}` : callDuration}</span>
                      </div>
                      <button
                        onClick={handleEndCall}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition"
                      >
                        <PhoneCall className="h-3.5 w-3.5 rotate-135" />
                        <span>End Call</span>
                      </button>
                    </div>
                  )}
                  {callStatus === 'COMPLETED' && (
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700"
                    >
                      <span>Replay Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Call Audio Wave Animation (When live) */}
              {callStatus === 'LIVE' && (
                <div className="flex items-center justify-center gap-1.5 py-4 border-b border-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-mono mr-2">Streaming Audio:</span>
                  {[24, 45, 18, 55, 30, 48, 20, 60, 35, 50, 22, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Real-time Dialogue Transcript */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 my-2">
                {callStatus === 'IDLE' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400">
                      <Mic className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">AI Voice Screening Ready</p>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Click "Initiate AI Screening Call" to simulate an interactive voice conversation checking clinic visit availability, lifestyle criteria, and booking informed consent.
                      </p>
                    </div>
                  </div>
                ) : (
                  conversationScript.slice(0, dialogueIndex + 1).map((turn) => {
                    const isAi = turn.sender === 'ai_screener';

                    return (
                      <div
                        key={turn.id}
                        className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-mono">
                          <span>{isAi ? 'Maya (AI Coordinator)' : selectedPatientRec?.patient.name[0]?.given[0]}</span>
                          <span>•</span>
                          <span>{turn.timestamp}</span>
                        </div>
                        <div className={`rounded-2xl px-4 py-3 text-xs max-w-lg leading-relaxed shadow-md ${
                          isAi
                            ? 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/80'
                            : 'bg-cyan-950/80 text-cyan-100 rounded-tr-none border border-cyan-800/60'
                        }`}>
                          <p>{turn.text}</p>
                          {turn.criteriaValidated && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{turn.criteriaValidated}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Call Completion Outcome Bar */}
              {callStatus === 'COMPLETED' && (
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/60 p-4 mt-auto space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Pre-Screening Complete: Patient Qualified & Consented</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Cal.com Synced</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Appointment confirmed for <strong>Tuesday at 10:00 AM</strong> with Dr. Thorne's clinical trial research coordinator. Information packet dispatched to patient email.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* AI SMS / Email Drafter */
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Protocol-Grounded Patient Invitation</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">IRB Form Template #482</span>
              </div>

              {generatedMessage && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subject Line:</label>
                    <input
                      type="text"
                      readOnly
                      value={generatedMessage.subject}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Personalized Message Body:</label>
                    <textarea
                      readOnly
                      rows={12}
                      value={generatedMessage.body}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="rounded-lg bg-cyan-950/30 border border-cyan-900/40 p-3 text-xs text-cyan-200">
                    <span className="font-bold block text-cyan-400 mb-0.5">Clinical Grounding Rationale:</span>
                    {generatedMessage.rationale}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => alert(`Outreach invitation dispatched via Twilio SMS to ${selectedPatientRec?.patient.telecom?.[0]?.value}`)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition"
                    >
                      <Send className="h-4 w-4" />
                      <span>Dispatch SMS & Email Outreach</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

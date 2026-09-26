// Patient Outreach, AI Voice Screening, and Audit Trail Types

export type OutreachStage =
  | 'IDENTIFIED'
  | 'ELIGIBLE_UNREVIEWED'
  | 'PHYSICIAN_CLEARED'
  | 'OUTREACH_PENDING'
  | 'SMS_CONTACTED'
  | 'VOICE_SCREENING_SCHEDULED'
  | 'VOICE_SCREENED'
  | 'CONSENT_PENDING'
  | 'ENROLLED'
  | 'DISQUALIFIED'
  | 'OPTED_OUT';

export interface VoiceCallDialogue {
  id: string;
  sender: 'ai_screener' | 'patient';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'hesitant' | 'declined';
  criteriaValidated?: string; // e.g. "Able to attend biweekly visits"
}

export interface VoiceScreeningSession {
  sessionId: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  trialId: string;
  trialName: string;
  callStatus: 'NOT_STARTED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'VOICEMAIL' | 'FAILED';
  durationSeconds: number;
  callStartedAt?: string;
  dialogue: VoiceCallDialogue[];
  voiceAiModel: 'ElevenLabs-Clinical-Conversational-v2' | 'Twilio-Voice-Agent';
  qualificationOutcome?: {
    passedLifestyleScreening: boolean;
    willingToConsent: boolean;
    appointmentBooked: boolean;
    appointmentSlot?: string;
    patientConcerns?: string;
  };
}

export interface OutreachCampaign {
  id: string;
  patientId: string;
  trialId: string;
  stage: OutreachStage;
  primaryContactChannel: 'SMS' | 'PHONE_VOICE' | 'EMAIL';
  lastActivityDate: string;
  assignedCoordinator: string;
  outreachNotes: string[];
  generatedMessage?: {
    subject?: string;
    body: string;
    groundedRationale: string;
    irbApprovalRef: string;
  };
  voiceSession?: VoiceScreeningSession;
}

export interface ClinicalAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'Principal Investigator' | 'Clinical Research Coordinator' | 'EHR Ingestion Pipeline' | 'AI Screening Engine';
  actionType:
    | 'CRITERIA_EVALUATED'
    | 'CLINICAL_OVERRIDE'
    | 'PHYSICIAN_SIGN_OFF'
    | 'PATIENT_OUTREACH_SENT'
    | 'VOICE_SCREENING_COMPLETED'
    | 'CONSENT_RECORDED'
    | 'EHR_SYNC_COMPLETED';
  patientId?: string;
  patientMrn?: string;
  trialId?: string;
  details: string;
  evidenceSnapshot?: {
    previousStatus?: string;
    newStatus?: string;
    overrideReason?: string;
  };
}

import { z } from 'zod';

// Criterion Rule Zod Schema
export const CriterionRuleSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['INCLUSION', 'EXCLUSION']),
  category: z.enum(['DEMOGRAPHICS', 'CONDITION', 'LABORATORY', 'MEDICATION', 'PROCEDURE', 'CLINICAL_NOTE']),
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().default(''),
  targetField: z.string().optional(),
  systemCode: z.string().optional(),
  systemName: z.enum(['LOINC', 'ICD-10', 'RxNorm', 'SNOMED-CT']).optional(),
  operator: z.enum(['>=', '<=', '>', '<', '==', '!=', 'BETWEEN', 'EXISTS', 'NOT_EXISTS', 'WITHIN_DAYS', 'MORE_THAN_DAYS_AGO', 'CONTAINS_TEXT', 'NOT_CONTAINS_TEXT']),
  thresholdValue: z.number().optional(),
  thresholdRange: z.object({ min: z.number(), max: z.number() }).optional(),
  thresholdString: z.string().optional(),
  expectedUnit: z.string().optional(),
  timeWindowDays: z.number().optional(),
  mustBeActive: z.boolean().optional(),
  requiredForEligibility: z.boolean().default(true),
});

// Protocol Zod Schema
export const TrialProtocolSchema = z.object({
  id: z.string().optional(),
  nctId: z.string().min(3),
  protocolNumber: z.string().min(1),
  title: z.string().min(5),
  shortTitle: z.string().min(2),
  indication: z.string().min(2),
  diseaseArea: z.enum(['Oncology', 'Endocrinology', 'Immunology', 'Cardiology', 'Neurology']),
  phase: z.enum(['Phase I', 'Phase I/II', 'Phase II', 'Phase III', 'Phase IV']),
  sponsor: z.string().min(1),
  principalInvestigator: z.string().min(1),
  targetEnrollment: z.number().positive(),
  currentEnrolled: z.number().nonnegative().default(0),
  status: z.enum(['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'UPCOMING', 'COMPLETED']),
  criteria: z.array(CriterionRuleSchema),
  rawProtocolText: z.string().optional(),
});

// Evaluate Request Schema
export const EvaluateRequestSchema = z.object({
  patientId: z.string().optional(),
  patientRecord: z.any().optional(),
  protocolId: z.string().min(1, 'Protocol ID is required'),
});

// Parse Protocol Synopsis Schema
export const ParseProtocolSchema = z.object({
  rawText: z.string().min(10, 'Protocol text must be at least 10 characters long'),
});

// Outreach Generation Request Schema
export const OutreachRequestSchema = z.object({
  patientId: z.string().min(1),
  trialId: z.string().min(1),
  channel: z.enum(['SMS', 'EMAIL', 'PHONE_VOICE']).default('SMS'),
});

// Clinician Override Schema
export const ClinicianOverrideSchema = z.object({
  patientId: z.string().min(1),
  criterionId: z.string().min(1),
  overriddenStatus: z.enum(['PASS', 'FAIL', 'MANUAL_REVIEW']),
  clinicianName: z.string().min(1),
  clinicianRole: z.string().min(1),
  overrideReason: z.string().min(5, 'Clinical justification must be at least 5 characters long'),
});

// EHR Sync Trigger Schema
export const EHRSyncRequestSchema = z.object({
  provider: z.enum(['Epic', 'athenahealth', 'eClinicalWorks', 'OncoEMR']),
  batchSize: z.number().optional().default(50),
  includeClinicalNotes: z.boolean().optional().default(true),
});

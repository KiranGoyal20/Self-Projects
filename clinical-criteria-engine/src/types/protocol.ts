// Protocol, Criteria Rules, and Evidence Grounding Types for Bond Health Engine

export type CriterionType = 'INCLUSION' | 'EXCLUSION';

export type CriterionCategory =
  | 'DEMOGRAPHICS'
  | 'CONDITION'
  | 'LABORATORY'
  | 'MEDICATION'
  | 'PROCEDURE'
  | 'CLINICAL_NOTE';

export type RuleOperator =
  | '>='
  | '<='
  | '>'
  | '<'
  | '=='
  | '!='
  | 'BETWEEN'
  | 'EXISTS'
  | 'NOT_EXISTS'
  | 'WITHIN_DAYS'
  | 'MORE_THAN_DAYS_AGO'
  | 'CONTAINS_TEXT'
  | 'NOT_CONTAINS_TEXT';

export type EvaluationStatus = 'PASS' | 'FAIL' | 'INCONCLUSIVE' | 'MANUAL_REVIEW';

export interface CriterionRule {
  id: string;
  type: CriterionType;
  category: CriterionCategory;
  name: string;
  description: string;
  // Deterministic Matching Fields
  targetField?: string; // 'age', 'gender', 'observation.value', 'condition.code', 'medication.code'
  systemCode?: string; // LOINC, ICD-10, RxNorm, SNOMED code
  systemName?: 'LOINC' | 'ICD-10' | 'RxNorm' | 'SNOMED-CT';
  operator: RuleOperator;
  thresholdValue?: number;
  thresholdRange?: { min: number; max: number };
  thresholdString?: string;
  expectedUnit?: string;
  timeWindowDays?: number; // e.g. 28 days for washout, 30 days for recent lab
  mustBeActive?: boolean;
  requiredForEligibility: boolean;
}

// Traceable Clinical Grounding Evidence
export interface CriterionEvidence {
  criterionId: string;
  criterionName: string;
  criterionType: CriterionType;
  status: EvaluationStatus;
  confidenceScore: number; // 0.0 - 1.0
  reasoning: string;
  
  // Explicit FHIR Resource Traceability
  sourceResourceType?: 'Patient' | 'Condition' | 'Observation' | 'MedicationRequest' | 'DocumentReference';
  sourceResourceId?: string;
  sourceCode?: string;
  sourceCodeDisplay?: string;
  recordedDate?: string;
  
  // Lab / Numeric Evidence
  valueObserved?: number | string;
  unitObserved?: string;
  referenceRangeText?: string;
  
  // Note / Unstructured Grounding Excerpt
  clinicalNoteExcerpt?: string;
  highlightTokens?: string[];
  
  // Clinician Manual Review & Override
  clinicianOverride?: {
    overriddenStatus: EvaluationStatus;
    clinicianName: string;
    clinicianRole: string;
    overrideReason: string;
    overriddenAt: string;
  };
}

export interface PatientTrialEvaluation {
  patientId: string;
  patientName: string;
  mrn: string;
  trialId: string;
  trialTitle: string;
  overallStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW';
  matchScore: number; // 0 - 100%
  evaluatedAt: string;
  
  // Counts
  inclusionMetCount: number;
  inclusionTotalCount: number;
  exclusionMetCount: number; // Ideally 0 for eligibility
  exclusionTotalCount: number;
  inconclusiveCount: number;
  
  // Detailed Evidence List
  criteriaResults: CriterionEvidence[];
  
  // Blockers (Reasons why patient failed)
  blockerReasons: string[];
  
  // Clinical Review Notes
  reviewStatus: 'PENDING' | 'CLEARED' | 'REJECTED';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TrialProtocol {
  id: string;
  nctId: string; // ClinicalTrials.gov ID (e.g. NCT05429188)
  protocolNumber: string;
  title: string;
  shortTitle: string;
  indication: string;
  diseaseArea: 'Oncology' | 'Endocrinology' | 'Immunology' | 'Cardiology' | 'Neurology';
  phase: 'Phase I' | 'Phase I/II' | 'Phase II' | 'Phase III' | 'Phase IV';
  sponsor: string;
  principalInvestigator: string;
  targetEnrollment: number;
  currentEnrolled: number;
  status: 'RECRUITING' | 'ACTIVE_NOT_RECRUITING' | 'UPCOMING' | 'COMPLETED';
  criteria: CriterionRule[];
  rawProtocolText?: string;
}

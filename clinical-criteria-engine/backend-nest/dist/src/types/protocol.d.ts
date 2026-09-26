export type CriterionType = 'INCLUSION' | 'EXCLUSION';
export type CriterionCategory = 'DEMOGRAPHICS' | 'CONDITION' | 'LABORATORY' | 'MEDICATION' | 'PROCEDURE' | 'CLINICAL_NOTE';
export type RuleOperator = '>=' | '<=' | '>' | '<' | '==' | '!=' | 'BETWEEN' | 'EXISTS' | 'NOT_EXISTS' | 'WITHIN_DAYS' | 'MORE_THAN_DAYS_AGO' | 'CONTAINS_TEXT' | 'NOT_CONTAINS_TEXT';
export type EvaluationStatus = 'PASS' | 'FAIL' | 'INCONCLUSIVE' | 'MANUAL_REVIEW';
export interface CriterionRule {
    id: string;
    type: CriterionType;
    category: CriterionCategory;
    name: string;
    description: string;
    targetField?: string;
    systemCode?: string;
    systemName?: 'LOINC' | 'ICD-10' | 'RxNorm' | 'SNOMED-CT';
    operator: RuleOperator;
    thresholdValue?: number;
    thresholdRange?: {
        min: number;
        max: number;
    };
    thresholdString?: string;
    expectedUnit?: string;
    timeWindowDays?: number;
    mustBeActive?: boolean;
    requiredForEligibility: boolean;
}
export interface CriterionEvidence {
    criterionId: string;
    criterionName: string;
    criterionType: CriterionType;
    status: EvaluationStatus;
    confidenceScore: number;
    reasoning: string;
    sourceResourceType?: 'Patient' | 'Condition' | 'Observation' | 'MedicationRequest' | 'DocumentReference';
    sourceResourceId?: string;
    sourceCode?: string;
    sourceCodeDisplay?: string;
    recordedDate?: string;
    valueObserved?: number | string;
    unitObserved?: string;
    referenceRangeText?: string;
    clinicalNoteExcerpt?: string;
    highlightTokens?: string[];
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
    matchScore: number;
    evaluatedAt: string;
    inclusionMetCount: number;
    inclusionTotalCount: number;
    exclusionMetCount: number;
    exclusionTotalCount: number;
    inconclusiveCount: number;
    criteriaResults: CriterionEvidence[];
    blockerReasons: string[];
    reviewStatus: 'PENDING' | 'CLEARED' | 'REJECTED';
    reviewNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
}
export interface TrialProtocol {
    id: string;
    nctId: string;
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

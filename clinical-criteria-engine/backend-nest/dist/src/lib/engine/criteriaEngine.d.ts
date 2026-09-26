import { FHIRPatientRecord } from '@/types/fhir';
import { TrialProtocol, CriterionRule, CriterionEvidence, PatientTrialEvaluation } from '@/types/protocol';
export declare function calculateAge(birthDateStr: string, asOfDate?: Date): number;
export declare function getDaysAgo(isoDateStr: string): number;
export declare function evaluateCriterion(rule: CriterionRule, record: FHIRPatientRecord): CriterionEvidence;
export declare function evaluatePatientForTrial(record: FHIRPatientRecord, protocol: TrialProtocol): PatientTrialEvaluation;

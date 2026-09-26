// HL7 FHIR R4 Standard TypeScript Definitions for Clinical Criteria Engine

export type FHIRResourceType =
  | 'Patient'
  | 'Condition'
  | 'Observation'
  | 'MedicationRequest'
  | 'MedicationStatement'
  | 'Procedure'
  | 'DocumentReference'
  | 'Encounter'
  | 'Bundle';

export interface FHIRIdentifier {
  system: string;
  value: string;
  type?: {
    coding: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
}

export interface FHIRCoding {
  system: string; // e.g. 'http://hl7.org/fhir/sid/icd-10-cm', 'http://loinc.org', 'http://www.nlm.nih.gov/research/umls/rxnorm', 'http://snomed.info/sct'
  code: string;
  display: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRQuantity {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export interface FHIRReference {
  reference: string; // e.g. "Patient/p-101"
  display?: string;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

// FHIR R4 Patient
export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier: FHIRIdentifier[];
  active: boolean;
  name: Array<{
    use?: string;
    text?: string;
    family: string;
    given: string[];
  }>;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string; // YYYY-MM-DD
  telecom?: Array<{
    system: 'phone' | 'email';
    value: string;
    use?: string;
  }>;
  address?: Array<{
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  communication?: Array<{
    language: FHIRCodeableConcept;
    preferred?: boolean;
  }>;
  extension?: Array<{
    url: string;
    valueString?: string;
    valueCode?: string;
  }>;
}

// FHIR R4 Condition (Diagnoses, Comorbidities, Histology)
export interface FHIRCondition {
  resourceType: 'Condition';
  id: string;
  subject: FHIRReference;
  clinicalStatus: {
    coding: Array<{
      system: 'http://terminology.hl7.org/CodeSystem/condition-clinical';
      code: 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
      display?: string;
    }>;
  };
  verificationStatus?: {
    coding: Array<{
      system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status';
      code: 'unconfirmed' | 'provisional' | 'differential' | 'confirmed' | 'refuted' | 'entered-in-error';
    }>;
  };
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept; // ICD-10-CM or SNOMED
  onsetDate?: string;
  recordedDate?: string;
  stage?: Array<{
    summary?: FHIRCodeableConcept; // e.g., "Stage IV", "Stage IIIB"
    type?: FHIRCodeableConcept;
  }>;
  note?: Array<{
    text: string;
    authorString?: string;
    time?: string;
  }>;
}

// FHIR R4 Observation (Labs, Biomarkers, Vitals, Genomics)
export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected';
  category?: FHIRCodeableConcept[]; // 'laboratory', 'vital-signs', 'exam'
  code: FHIRCodeableConcept; // LOINC code
  subject: FHIRReference;
  effectiveDateTime: string; // ISO 8601
  issued?: string;
  valueQuantity?: FHIRQuantity;
  valueString?: string;
  valueCodeableConcept?: FHIRCodeableConcept; // Positive/Negative/Detected
  interpretation?: Array<{
    coding: Array<{
      system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';
      code: 'L' | 'H' | 'N' | 'A' | 'POS' | 'NEG'; // Low, High, Normal, Abnormal, Positive
      display?: string;
    }>;
  }>;
  referenceRange?: Array<{
    low?: FHIRQuantity;
    high?: FHIRQuantity;
    text?: string;
  }>;
  note?: Array<{
    text: string;
  }>;
}

// FHIR R4 MedicationRequest (Prescriptions, Prior Therapies)
export interface FHIRMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  status: 'active' | 'completed' | 'cancelled' | 'stopped' | 'on-hold';
  intent: 'order' | 'plan' | 'proposal';
  medicationCodeableConcept: FHIRCodeableConcept; // RxNorm
  subject: FHIRReference;
  authoredOn: string;
  dosageInstruction?: Array<{
    text?: string;
    timing?: {
      repeat?: {
        frequency?: number;
        period?: number;
        periodUnit?: 'd' | 'wk' | 'mo';
      };
    };
    doseAndRate?: Array<{
      doseQuantity?: FHIRQuantity;
    }>;
  }>;
  dispenseRequest?: {
    validityPeriod?: FHIRPeriod;
  };
  note?: Array<{
    text: string;
  }>;
}

// FHIR R4 Procedure (Surgeries, Biopsies, Radiotherapy)
export interface FHIRProcedure {
  resourceType: 'Procedure';
  id: string;
  status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed';
  code: FHIRCodeableConcept; // CPT or SNOMED
  subject: FHIRReference;
  performedDateTime?: string;
  performedPeriod?: FHIRPeriod;
  outcome?: FHIRCodeableConcept;
  note?: Array<{ text: string }>;
}

// FHIR R4 DocumentReference (Clinical Notes, Pathology Reports, Imaging)
export interface FHIRDocumentReference {
  resourceType: 'DocumentReference';
  id: string;
  status: 'current' | 'superseded';
  type: FHIRCodeableConcept; // Progress note, Pathology report, Discharge summary
  category?: FHIRCodeableConcept[];
  subject: FHIRReference;
  date: string; // ISO 8601
  author?: Array<{ display: string }>;
  description?: string;
  content: Array<{
    attachment: {
      contentType: string; // 'text/plain' or 'application/pdf'
      data?: string; // base64
      title?: string;
      textSnippet?: string; // Plaintext excerpt for clinical search
    };
  }>;
}

// Complete Patient Clinical Record Bundle
export interface FHIRPatientRecord {
  patient: FHIRPatient;
  conditions: FHIRCondition[];
  observations: FHIRObservation[];
  medications: FHIRMedicationRequest[];
  procedures: FHIRProcedure[];
  documents: FHIRDocumentReference[];
  ehrSource: 'Epic' | 'athenahealth' | 'eClinicalWorks' | 'OncoEMR';
  lastSynced: string;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'collection' | 'batch' | 'transaction';
  total?: number;
  entry: Array<{
    resource:
      | FHIRPatient
      | FHIRCondition
      | FHIRObservation
      | FHIRMedicationRequest
      | FHIRProcedure
      | FHIRDocumentReference;
  }>;
}

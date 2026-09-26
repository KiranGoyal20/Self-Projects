export type FHIRResourceType = 'Patient' | 'Condition' | 'Observation' | 'MedicationRequest' | 'MedicationStatement' | 'Procedure' | 'DocumentReference' | 'Encounter' | 'Bundle';
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
    system: string;
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
    reference: string;
    display?: string;
}
export interface FHIRPeriod {
    start?: string;
    end?: string;
}
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
    birthDate: string;
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
    code: FHIRCodeableConcept;
    onsetDate?: string;
    recordedDate?: string;
    stage?: Array<{
        summary?: FHIRCodeableConcept;
        type?: FHIRCodeableConcept;
    }>;
    note?: Array<{
        text: string;
        authorString?: string;
        time?: string;
    }>;
}
export interface FHIRObservation {
    resourceType: 'Observation';
    id: string;
    status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected';
    category?: FHIRCodeableConcept[];
    code: FHIRCodeableConcept;
    subject: FHIRReference;
    effectiveDateTime: string;
    issued?: string;
    valueQuantity?: FHIRQuantity;
    valueString?: string;
    valueCodeableConcept?: FHIRCodeableConcept;
    interpretation?: Array<{
        coding: Array<{
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';
            code: 'L' | 'H' | 'N' | 'A' | 'POS' | 'NEG';
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
export interface FHIRMedicationRequest {
    resourceType: 'MedicationRequest';
    id: string;
    status: 'active' | 'completed' | 'cancelled' | 'stopped' | 'on-hold';
    intent: 'order' | 'plan' | 'proposal';
    medicationCodeableConcept: FHIRCodeableConcept;
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
export interface FHIRProcedure {
    resourceType: 'Procedure';
    id: string;
    status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed';
    code: FHIRCodeableConcept;
    subject: FHIRReference;
    performedDateTime?: string;
    performedPeriod?: FHIRPeriod;
    outcome?: FHIRCodeableConcept;
    note?: Array<{
        text: string;
    }>;
}
export interface FHIRDocumentReference {
    resourceType: 'DocumentReference';
    id: string;
    status: 'current' | 'superseded';
    type: FHIRCodeableConcept;
    category?: FHIRCodeableConcept[];
    subject: FHIRReference;
    date: string;
    author?: Array<{
        display: string;
    }>;
    description?: string;
    content: Array<{
        attachment: {
            contentType: string;
            data?: string;
            title?: string;
            textSnippet?: string;
        };
    }>;
}
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
        resource: FHIRPatient | FHIRCondition | FHIRObservation | FHIRMedicationRequest | FHIRProcedure | FHIRDocumentReference;
    }>;
}

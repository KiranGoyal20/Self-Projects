import { FHIRPatientRecord } from '@/types/fhir';

export const SAMPLE_PATIENTS: FHIRPatientRecord[] = [
  // Patient 1: Eleanor Vance - Ideal Match for BOND-001 (NSCLC EGFR+)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-001',
      identifier: [
        { system: 'http://hospital.epic.org/mrn', value: 'MRN-784920' }
      ],
      active: true,
      name: [{ family: 'Vance', given: ['Eleanor', 'R.'] }],
      gender: 'female',
      birthDate: '1965-04-12', // Age ~61
      telecom: [
        { system: 'phone', value: '+1 (555) 234-8901' },
        { system: 'email', value: 'e.vance@example.com' }
      ],
      address: [{ city: 'Boston', state: 'MA', postalCode: '02115' }]
    },
    ehrSource: 'Epic',
    lastSynced: '2026-09-14T08:30:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-001-1',
        subject: { reference: 'Patient/p-001' },
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
        },
        code: {
          coding: [
            { system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.90', display: 'Malignant neoplasm of unspecified part of bronchus or lung' }
          ],
          text: 'Stage IV Non-Small Cell Lung Cancer (Adenocarcinoma)'
        },
        stage: [{ summary: { text: 'Stage IV (T2a N2 M1a)' } }],
        onsetDate: '2025-11-20'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-001-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR gene targeted mutation analysis' }],
          text: 'EGFR Molecular Testing'
        },
        effectiveDateTime: '2026-07-15T10:00:00Z',
        valueString: 'POSITIVE (Exon 19 deletion detected)',
        interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'POS', display: 'Positive' }] }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-001-anc',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'Absolute Neutrophil Count' }],
          text: 'Absolute Neutrophil Count (ANC)'
        },
        effectiveDateTime: '2026-08-28T09:15:00Z',
        valueQuantity: { value: 2450, unit: '/uL' },
        referenceRange: [{ low: { value: 1500, unit: '/uL' }, high: { value: 7500, unit: '/uL' } }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-001-plt',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelet count' }],
          text: 'Platelets'
        },
        effectiveDateTime: '2026-08-28T09:15:00Z',
        valueQuantity: { value: 215000, unit: '/uL' },
        referenceRange: [{ low: { value: 150000, unit: '/uL' }, high: { value: 400000, unit: '/uL' } }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-001-egfr-renal',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR CKD-EPI 2021' }],
          text: 'Estimated GFR'
        },
        effectiveDateTime: '2026-08-28T09:15:00Z',
        valueQuantity: { value: 78, unit: 'mL/min/1.73m2' },
        referenceRange: [{ low: { value: 60, unit: 'mL/min/1.73m2' } }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-001-qtc',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '8634-9', display: 'QTcF interval ECG' }],
          text: 'QTcF Interval'
        },
        effectiveDateTime: '2026-08-10T14:30:00Z',
        valueQuantity: { value: 422, unit: 'ms' },
        referenceRange: [{ high: { value: 450, unit: 'ms' } }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-001-hepb',
        status: 'final',
        subject: { reference: 'Patient/p-001' },
        code: {
          coding: [{ system: 'http://loinc.org', code: '5195-3', display: 'Hepatitis B Surface Ag' }]
        },
        effectiveDateTime: '2026-06-12T11:00:00Z',
        valueString: 'NEGATIVE'
      }
    ],
    medications: [
      {
        resourceType: 'MedicationRequest',
        id: 'med-001-carboplatin',
        status: 'completed',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: 'CHEMO-1', display: 'Carboplatin AUC 5' }],
          text: 'Carboplatin Chemotherapy'
        },
        subject: { reference: 'Patient/p-001' },
        authoredOn: '2026-05-10' // > 3 months ago (washout satisfied)
      }
    ],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-001-onc',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Consultation note' }], text: 'Thoracic Oncology Encounter Note' },
        subject: { reference: 'Patient/p-001' },
        date: '2026-08-28T14:00:00Z',
        author: [{ display: 'Dr. Michael Sterling, MD' }],
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'Patient presents for thoracic oncology restaging. ECOG performance status 1 (ambulatory, capable of all self-care). Repeat Brain MRI (2026-08-15) shows no intracranial metastatic disease. Overall functional status remains robust.'
          }
        }]
      }
    ]
  },

  // Patient 2: David Miller - Excluded due to Low ANC (Bone Marrow Suppression)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-002',
      identifier: [{ system: 'http://hospital.epic.org/mrn', value: 'MRN-482019' }],
      active: true,
      name: [{ family: 'Miller', given: ['David', 'K.'] }],
      gender: 'male',
      birthDate: '1968-09-22', // Age ~58
      telecom: [{ system: 'phone', value: '+1 (555) 345-6789' }]
    },
    ehrSource: 'Epic',
    lastSynced: '2026-09-14T07:15:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-002-1',
        subject: { reference: 'Patient/p-002' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.11', display: 'Malignant neoplasm of upper lobe, right bronchus or lung' }],
          text: 'Stage IV NSCLC Adenocarcinoma'
        },
        onsetDate: '2026-01-14'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-002-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-002' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2026-02-10T10:00:00Z',
        valueString: 'POSITIVE (L858R mutation detected)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-002-anc',
        status: 'final',
        subject: { reference: 'Patient/p-002' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'Absolute Neutrophil Count' }] },
        effectiveDateTime: '2026-09-02T11:00:00Z',
        valueQuantity: { value: 1120, unit: '/uL' }, // FAIL: < 1500
        referenceRange: [{ low: { value: 1500, unit: '/uL' } }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-002-plt',
        status: 'final',
        subject: { reference: 'Patient/p-002' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelet count' }] },
        effectiveDateTime: '2026-09-02T11:00:00Z',
        valueQuantity: { value: 142000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-002-egfr-renal',
        status: 'final',
        subject: { reference: 'Patient/p-002' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-09-02T11:00:00Z',
        valueQuantity: { value: 68, unit: 'mL/min/1.73m2' }
      }
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-002',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Progress note' }] },
        subject: { reference: 'Patient/p-002' },
        date: '2026-09-02T12:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG performance status 1. Patient reports mild fatigue. Lab evaluation notable for persistent neutropenia with ANC 1,120 /uL.'
          }
        }]
      }
    ]
  },

  // Patient 3: Sarah Jenkins - Excluded due to Active Brain Metastases (ICD C79.31)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-003',
      identifier: [{ system: 'http://hospital.oncoemr.org/mrn', value: 'ONC-991204' }],
      active: true,
      name: [{ family: 'Jenkins', given: ['Sarah', 'M.'] }],
      gender: 'female',
      birthDate: '1962-02-18', // Age ~64
      telecom: [{ system: 'phone', value: '+1 (555) 456-7890' }]
    },
    ehrSource: 'OncoEMR',
    lastSynced: '2026-09-14T09:00:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-003-lung',
        subject: { reference: 'Patient/p-003' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.9', display: 'Malignant neoplasm of lung' }],
          text: 'Metastatic NSCLC'
        },
        onsetDate: '2025-08-10'
      },
      {
        resourceType: 'Condition',
        id: 'cond-003-brain',
        subject: { reference: 'Patient/p-003' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C79.31', display: 'Secondary malignant neoplasm of brain' }],
          text: 'Active Brain Metastases'
        },
        onsetDate: '2026-08-01'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-003-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-003' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2025-08-20T10:00:00Z',
        valueString: 'POSITIVE (Exon 19 del)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-003-anc',
        status: 'final',
        subject: { reference: 'Patient/p-003' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-08-25T10:00:00Z',
        valueQuantity: { value: 2100, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-003-plt',
        status: 'final',
        subject: { reference: 'Patient/p-003' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelets' }] },
        effectiveDateTime: '2026-08-25T10:00:00Z',
        valueQuantity: { value: 180000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-003-egfr-renal',
        status: 'final',
        subject: { reference: 'Patient/p-003' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-25T10:00:00Z',
        valueQuantity: { value: 72, unit: 'mL/min/1.73m2' }
      }
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-003',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Oncology note' }] },
        subject: { reference: 'Patient/p-003' },
        date: '2026-08-25T14:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'Recent brain MRI on 2026-08-01 revealed 3 new supratentorial lesions consistent with active brain metastases. Patient initiated on Dexamethasone.'
          }
        }]
      }
    ]
  },

  // Patient 4: Robert Chen - Borderline Renal (eGFR 58 vs threshold 60) -> NEEDS REVIEW
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-004',
      identifier: [{ system: 'http://hospital.athena.org/mrn', value: 'ATH-339182' }],
      active: true,
      name: [{ family: 'Chen', given: ['Robert', 'L.'] }],
      gender: 'male',
      birthDate: '1974-05-10', // Age ~52
      telecom: [{ system: 'phone', value: '+1 (555) 567-8901' }]
    },
    ehrSource: 'athenahealth',
    lastSynced: '2026-09-14T06:00:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-004-1',
        subject: { reference: 'Patient/p-004' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.30', display: 'Malignant neoplasm of lower lobe lung' }]
        },
        onsetDate: '2026-03-01'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-004-egfr-mut',
        status: 'final',
        subject: { reference: 'Patient/p-004' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2026-03-15T10:00:00Z',
        valueString: 'POSITIVE (Exon 19 deletion)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-004-anc',
        status: 'final',
        subject: { reference: 'Patient/p-004' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-08-30T10:00:00Z',
        valueQuantity: { value: 1950, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-004-plt',
        status: 'final',
        subject: { reference: 'Patient/p-004' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelets' }] },
        effectiveDateTime: '2026-08-30T10:00:00Z',
        valueQuantity: { value: 165000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-004-renal',
        status: 'final',
        subject: { reference: 'Patient/p-004' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-30T10:00:00Z',
        valueQuantity: { value: 58, unit: 'mL/min/1.73m2' }, // Borderline below 60
        note: [{ text: 'eGFR fluctuated between 58 and 62 over last 6 months. May qualify on repeat creatinine clearance.' }]
      }
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-004',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Progress note' }] },
        subject: { reference: 'Patient/p-004' },
        date: '2026-08-30T12:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG performance status 1. Highly motivated for clinical trial. Renal function stable with eGFR 58, asymptomatic.'
          }
        }]
      }
    ]
  },

  // Patient 5: Maria Santos - Excluded due to Chemotherapy Washout Violation (Carboplatin 10 days ago)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-005',
      identifier: [{ system: 'http://hospital.ecw.org/mrn', value: 'ECW-192844' }],
      active: true,
      name: [{ family: 'Santos', given: ['Maria', 'G.'] }],
      gender: 'female',
      birthDate: '1957-11-04', // Age ~69
      telecom: [{ system: 'phone', value: '+1 (555) 678-9012' }]
    },
    ehrSource: 'eClinicalWorks',
    lastSynced: '2026-09-14T05:45:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-005-1',
        subject: { reference: 'Patient/p-005' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.9', display: 'Malignant neoplasm of lung' }]
        },
        onsetDate: '2025-10-15'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-005-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-005' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2025-11-01T10:00:00Z',
        valueString: 'POSITIVE (L858R)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-005-anc',
        status: 'final',
        subject: { reference: 'Patient/p-005' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-09-05T09:00:00Z',
        valueQuantity: { value: 1800, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-005-plt',
        status: 'final',
        subject: { reference: 'Patient/p-005' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelets' }] },
        effectiveDateTime: '2026-09-05T09:00:00Z',
        valueQuantity: { value: 190000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-005-renal',
        status: 'final',
        subject: { reference: 'Patient/p-005' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-09-05T09:00:00Z',
        valueQuantity: { value: 65, unit: 'mL/min/1.73m2' }
      }
    ],
    medications: [
      {
        resourceType: 'MedicationRequest',
        id: 'med-005-chemo',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: 'CHEMO-2', display: 'Pemetrexed / Carboplatin' }],
          text: 'Pemetrexed infusion'
        },
        subject: { reference: 'Patient/p-005' },
        authoredOn: '2026-09-04' // Violates 28-day washout period
      }
    ],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-005',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Progress note' }] },
        subject: { reference: 'Patient/p-005' },
        date: '2026-09-04T16:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG 1. Received Cycle 4 Pemetrexed on 2026-09-04 without immediate adverse events. Study screening must wait until 28-day washout window expires.'
          }
        }]
      }
    ]
  },

  // Patient 6: Arthur Pendelton - Ideal Match for BOND-002 (Type 2 Diabetes + CKD)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-006',
      identifier: [{ system: 'http://hospital.epic.org/mrn', value: 'MRN-881920' }],
      active: true,
      name: [{ family: 'Pendelton', given: ['Arthur', 'B.'] }],
      gender: 'male',
      birthDate: '1960-03-14', // Age ~66
      telecom: [{ system: 'phone', value: '+1 (555) 789-0123' }]
    },
    ehrSource: 'Epic',
    lastSynced: '2026-09-14T08:15:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-006-t2d',
        subject: { reference: 'Patient/p-006' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.22', display: 'Type 2 diabetes mellitus with diabetic chronic kidney disease' }],
          text: 'Type 2 Diabetes Mellitus with CKD'
        },
        onsetDate: '2020-05-12'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-006-hba1c',
        status: 'final',
        subject: { reference: 'Patient/p-006' },
        code: { coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c' }] },
        effectiveDateTime: '2026-08-20T08:00:00Z',
        valueQuantity: { value: 8.6, unit: '%' } // Meets 7.0 - 10.5%
      },
      {
        resourceType: 'Observation',
        id: 'obs-006-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-006' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-20T08:00:00Z',
        valueQuantity: { value: 54, unit: 'mL/min/1.73m2' } // Meets 30 - 90
      },
      {
        resourceType: 'Observation',
        id: 'obs-006-uacr',
        status: 'final',
        subject: { reference: 'Patient/p-006' },
        code: { coding: [{ system: 'http://loinc.org', code: '14958-3', display: 'Microalbumin/Creatinine Urine' }] },
        effectiveDateTime: '2026-08-20T08:00:00Z',
        valueQuantity: { value: 78, unit: 'mg/g' } // Meets >= 30
      }
    ],
    medications: [
      {
        resourceType: 'MedicationRequest',
        id: 'med-006-metformin',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '6809', display: 'Metformin hydrochloride 500 MG' }],
          text: 'Metformin 500mg BID'
        },
        subject: { reference: 'Patient/p-006' },
        authoredOn: '2025-01-10'
      }
    ],
    procedures: [],
    documents: []
  },

  // Patient 7: Jennifer Hayes - Disqualified from T2D Trial (HbA1c 6.4%, below 7.0%)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-007',
      identifier: [{ system: 'http://hospital.athena.org/mrn', value: 'ATH-519280' }],
      active: true,
      name: [{ family: 'Hayes', given: ['Jennifer', 'S.'] }],
      gender: 'female',
      birthDate: '1984-07-29', // Age ~42
      telecom: [{ system: 'phone', value: '+1 (555) 890-1234' }]
    },
    ehrSource: 'athenahealth',
    lastSynced: '2026-09-14T07:45:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-007-t2d',
        subject: { reference: 'Patient/p-007' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' }]
        },
        onsetDate: '2023-09-01'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-007-hba1c',
        status: 'final',
        subject: { reference: 'Patient/p-007' },
        code: { coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c' }] },
        effectiveDateTime: '2026-08-15T09:30:00Z',
        valueQuantity: { value: 6.4, unit: '%' } // Excluded: < 7.0%
      },
      {
        resourceType: 'Observation',
        id: 'obs-007-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-007' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-15T09:30:00Z',
        valueQuantity: { value: 85, unit: 'mL/min/1.73m2' }
      }
    ],
    medications: [],
    procedures: [],
    documents: []
  },

  // Patient 8: Carlos Gomez - Excluded from T2D Trial (History of DKA E11.1)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-008',
      identifier: [{ system: 'http://hospital.ecw.org/mrn', value: 'ECW-449102' }],
      active: true,
      name: [{ family: 'Gomez', given: ['Carlos', 'A.'] }],
      gender: 'male',
      birthDate: '1971-12-08', // Age ~55
      telecom: [{ system: 'phone', value: '+1 (555) 901-2345' }]
    },
    ehrSource: 'eClinicalWorks',
    lastSynced: '2026-09-14T06:30:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-008-t2d',
        subject: { reference: 'Patient/p-008' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.10', display: 'Type 2 diabetes mellitus with ketoacidosis without coma' }]
        },
        onsetDate: '2024-02-14'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-008-hba1c',
        status: 'final',
        subject: { reference: 'Patient/p-008' },
        code: { coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c' }] },
        effectiveDateTime: '2026-08-10T10:00:00Z',
        valueQuantity: { value: 9.1, unit: '%' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-008-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-008' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-10T10:00:00Z',
        valueQuantity: { value: 48, unit: 'mL/min/1.73m2' }
      }
    ],
    medications: [],
    procedures: [],
    documents: []
  },

  // Patient 9: Frank Kowalski - Match for BOND-003 (CAR-T DLBCL CD19+)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-009',
      identifier: [{ system: 'http://hospital.oncoemr.org/mrn', value: 'ONC-772911' }],
      active: true,
      name: [{ family: 'Kowalski', given: ['Frank', 'J.'] }],
      gender: 'male',
      birthDate: '1963-08-17', // Age ~63
      telecom: [{ system: 'phone', value: '+1 (555) 012-3456' }]
    },
    ehrSource: 'OncoEMR',
    lastSynced: '2026-09-14T08:45:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-009-dlbcl',
        subject: { reference: 'Patient/p-009' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'relapse' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C83.30', display: 'Diffuse large B-cell lymphoma, unspecified site' }]
        },
        onsetDate: '2024-06-01'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-009-cd19',
        status: 'final',
        subject: { reference: 'Patient/p-009' },
        code: { coding: [{ system: 'http://loinc.org', code: '55447-7', display: 'CD19 expression' }] },
        effectiveDateTime: '2026-07-22T11:00:00Z',
        valueString: 'POSITIVE (>90% tumor cell membrane expression)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-009-anc',
        status: 'final',
        subject: { reference: 'Patient/p-009' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-08-28T09:00:00Z',
        valueQuantity: { value: 1450, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-009-lvef',
        status: 'final',
        subject: { reference: 'Patient/p-009' },
        code: { coding: [{ system: 'http://loinc.org', code: '88062-5', display: 'Left ventricular ejection fraction' }] },
        effectiveDateTime: '2026-08-14T15:00:00Z',
        valueQuantity: { value: 55, unit: '%' }
      }
    ],
    medications: [
      {
        resourceType: 'MedicationRequest',
        id: 'med-009-rchop',
        status: 'completed',
        intent: 'order',
        medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: 'RCHOP', display: 'R-CHOP regimen (Line 1)' }] },
        subject: { reference: 'Patient/p-009' },
        authoredOn: '2024-07-01'
      },
      {
        resourceType: 'MedicationRequest',
        id: 'med-009-rice',
        status: 'completed',
        intent: 'order',
        medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: 'RICE', display: 'R-ICE salvage chemotherapy (Line 2)' }] },
        subject: { reference: 'Patient/p-009' },
        authoredOn: '2025-10-15'
      }
    ],
    procedures: [],
    documents: []
  },

  // Patient 10: Amina Al-Mansoor - Missing Laboratory Data -> INCONCLUSIVE
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-010',
      identifier: [{ system: 'http://hospital.epic.org/mrn', value: 'MRN-330192' }],
      active: true,
      name: [{ family: 'Al-Mansoor', given: ['Amina', 'H.'] }],
      gender: 'female',
      birthDate: '1975-01-30', // Age ~51
      telecom: [{ system: 'phone', value: '+1 (555) 123-4567' }]
    },
    ehrSource: 'Epic',
    lastSynced: '2026-09-14T08:00:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-010-lung',
        subject: { reference: 'Patient/p-010' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.9', display: 'Malignant neoplasm of lung' }]
        },
        onsetDate: '2026-02-10'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-010-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-010' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2026-02-25T10:00:00Z',
        valueString: 'POSITIVE (Exon 19 del)'
      }
      // Note: Missing ANC, Platelets, and Renal panel (simulating missing bulk records)
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-010',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Progress note' }] },
        subject: { reference: 'Patient/p-010' },
        date: '2026-08-10T11:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG 1. Patient recently relocated from another health system. External lab work pending receipt.'
          }
        }]
      }
    ]
  },

  // Patient 11: Thomas Wright - Cardiac QTc Prolongation (QTcF 482 ms > 470)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-011',
      identifier: [{ system: 'http://hospital.athena.org/mrn', value: 'ATH-901827' }],
      active: true,
      name: [{ family: 'Wright', given: ['Thomas', 'E.'] }],
      gender: 'male',
      birthDate: '1954-06-25', // Age ~72
      telecom: [{ system: 'phone', value: '+1 (555) 234-5678' }]
    },
    ehrSource: 'athenahealth',
    lastSynced: '2026-09-14T07:30:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-011-lung',
        subject: { reference: 'Patient/p-011' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.10', display: 'Malignant neoplasm of upper lobe, bronchus' }]
        },
        onsetDate: '2026-01-20'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-011-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-011' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2026-02-01T10:00:00Z',
        valueString: 'POSITIVE (L858R)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-011-anc',
        status: 'final',
        subject: { reference: 'Patient/p-011' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-08-20T09:00:00Z',
        valueQuantity: { value: 2300, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-011-plt',
        status: 'final',
        subject: { reference: 'Patient/p-011' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelets' }] },
        effectiveDateTime: '2026-08-20T09:00:00Z',
        valueQuantity: { value: 240000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-011-egfr-renal',
        status: 'final',
        subject: { reference: 'Patient/p-011' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-08-20T09:00:00Z',
        valueQuantity: { value: 68, unit: 'mL/min/1.73m2' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-011-qtc',
        status: 'final',
        subject: { reference: 'Patient/p-011' },
        code: { coding: [{ system: 'http://loinc.org', code: '8634-9', display: 'QTcF interval' }] },
        effectiveDateTime: '2026-08-25T14:00:00Z',
        valueQuantity: { value: 486, unit: 'ms' } // EXCLUSION: > 470 ms
      }
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-011',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Oncology note' }] },
        subject: { reference: 'Patient/p-011' },
        date: '2026-08-25T15:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG 1. Electrocardiogram demonstrates QTcF interval prolongation at 486 ms, likely secondary to Amiodarone.'
          }
        }]
      }
    ]
  },

  // Patient 12: Grace O'Connor - Fully Eligible for BOND-001 (ECOG 0, EGFR Exon 19 del)
  {
    patient: {
      resourceType: 'Patient',
      id: 'p-012',
      identifier: [{ system: 'http://hospital.epic.org/mrn', value: 'MRN-651093' }],
      active: true,
      name: [{ family: "O'Connor", given: ['Grace', 'A.'] }],
      gender: 'female',
      birthDate: '1967-10-19', // Age ~59
      telecom: [{ system: 'phone', value: '+1 (555) 345-6780' }]
    },
    ehrSource: 'Epic',
    lastSynced: '2026-09-14T08:40:00Z',
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-012-lung',
        subject: { reference: 'Patient/p-012' },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        code: {
          coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'C34.90', display: 'Malignant neoplasm of bronchus or lung' }]
        },
        onsetDate: '2026-04-10'
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs-012-egfr',
        status: 'final',
        subject: { reference: 'Patient/p-012' },
        code: { coding: [{ system: 'http://loinc.org', code: '48000-4', display: 'EGFR Mutation' }] },
        effectiveDateTime: '2026-05-02T10:00:00Z',
        valueString: 'POSITIVE (Exon 19 deletion)'
      },
      {
        resourceType: 'Observation',
        id: 'obs-012-anc',
        status: 'final',
        subject: { reference: 'Patient/p-012' },
        code: { coding: [{ system: 'http://loinc.org', code: '26499-4', display: 'ANC' }] },
        effectiveDateTime: '2026-09-01T09:00:00Z',
        valueQuantity: { value: 2900, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-012-plt',
        status: 'final',
        subject: { reference: 'Patient/p-012' },
        code: { coding: [{ system: 'http://loinc.org', code: '777-3', display: 'Platelets' }] },
        effectiveDateTime: '2026-09-01T09:00:00Z',
        valueQuantity: { value: 265000, unit: '/uL' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-012-renal',
        status: 'final',
        subject: { reference: 'Patient/p-012' },
        code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'eGFR' }] },
        effectiveDateTime: '2026-09-01T09:00:00Z',
        valueQuantity: { value: 88, unit: 'mL/min/1.73m2' }
      },
      {
        resourceType: 'Observation',
        id: 'obs-012-qtc',
        status: 'final',
        subject: { reference: 'Patient/p-012' },
        code: { coding: [{ system: 'http://loinc.org', code: '8634-9', display: 'QTcF interval' }] },
        effectiveDateTime: '2026-09-01T09:00:00Z',
        valueQuantity: { value: 418, unit: 'ms' }
      }
    ],
    medications: [],
    procedures: [],
    documents: [
      {
        resourceType: 'DocumentReference',
        id: 'doc-012',
        status: 'current',
        type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Progress note' }] },
        subject: { reference: 'Patient/p-012' },
        date: '2026-09-01T14:00:00Z',
        content: [{
          attachment: {
            contentType: 'text/plain',
            textSnippet: 'ECOG 0. Patient is fully active, asymptomatic, and eager to participate in biomarker-directed trials. Brain MRI negative for metastases.'
          }
        }]
      }
    ]
  }
];

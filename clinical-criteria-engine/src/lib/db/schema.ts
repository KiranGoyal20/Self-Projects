// PostgreSQL on Amazon Aurora Schema using Drizzle ORM & pgvector
// Models the complete Bond Health Clinical Criteria Engine persistence layer

export interface DrizzleTableDefinition {
  tableName: string;
  columns: Record<string, string>;
  indexes?: string[];
}

/**
 * Aurora PostgreSQL Data Architecture
 */
export const DATABASE_SCHEMA = {
  // 1. Core Patient EHR Records
  patients: {
    tableName: 'patients',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      mrn: 'varchar(64) NOT NULL UNIQUE',
      ehrSource: 'varchar(32) NOT NULL', // 'Epic', 'athenahealth', 'eClinicalWorks', 'OncoEMR'
      externalPatientId: 'varchar(128) NOT NULL',
      firstName: 'varchar(128) NOT NULL',
      lastName: 'varchar(128) NOT NULL',
      gender: 'varchar(16) NOT NULL',
      birthDate: 'date NOT NULL',
      phone: 'varchar(32)',
      email: 'varchar(128)',
      addressCity: 'varchar(64)',
      addressState: 'varchar(32)',
      active: 'boolean DEFAULT true NOT NULL',
      lastSyncedAt: 'timestamp with time zone NOT NULL DEFAULT now()',
      createdAt: 'timestamp with time zone NOT NULL DEFAULT now()',
      updatedAt: 'timestamp with time zone NOT NULL DEFAULT now()'
    },
    indexes: ['CREATE INDEX idx_patients_mrn ON patients(mrn)', 'CREATE INDEX idx_patients_ehr ON patients(ehrSource)']
  },

  // 2. Clinical Diagnoses & Conditions (ICD-10-CM / SNOMED CT)
  conditions: {
    tableName: 'conditions',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      patientId: 'uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL',
      codeSystem: 'varchar(32) NOT NULL', // 'ICD-10', 'SNOMED-CT'
      code: 'varchar(32) NOT NULL', // e.g. 'C34.90', 'E11.22'
      display: 'text NOT NULL',
      clinicalStatus: 'varchar(16) NOT NULL DEFAULT "active"', // 'active', 'recurrence', 'resolved'
      stageText: 'varchar(64)', // 'Stage IV'
      onsetDate: 'date',
      recordedDate: 'date',
      rawFhirResource: 'jsonb'
    },
    indexes: ['CREATE INDEX idx_conditions_code ON conditions(code)', 'CREATE INDEX idx_conditions_patient ON conditions(patientId)']
  },

  // 3. Laboratory Observations & Biomarkers (LOINC)
  observations: {
    tableName: 'observations',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      patientId: 'uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL',
      loincCode: 'varchar(32) NOT NULL', // e.g. '26499-4' (ANC), '33914-3' (eGFR)
      name: 'text NOT NULL',
      effectiveDateTime: 'timestamp with time zone NOT NULL',
      valueQuantity: 'double precision',
      valueUnit: 'varchar(32)',
      valueString: 'text', // e.g. 'POSITIVE (Exon 19 del)'
      interpretation: 'varchar(16)', // 'H', 'L', 'POS', 'NEG'
      referenceRangeLow: 'double precision',
      referenceRangeHigh: 'double precision',
      rawFhirResource: 'jsonb'
    },
    indexes: ['CREATE INDEX idx_observations_loinc ON observations(loincCode)', 'CREATE INDEX idx_observations_patient_date ON observations(patientId, effectiveDateTime DESC)']
  },

  // 4. Clinical Encounter Notes & Pathology Reports with pgvector Embeddings
  clinicalDocuments: {
    tableName: 'clinical_documents',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      patientId: 'uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL',
      documentType: 'varchar(64) NOT NULL', // 'Thoracic Oncology Encounter', 'Pathology'
      date: 'timestamp with time zone NOT NULL',
      contentSnippet: 'text NOT NULL',
      // pgvector embedding column for protocol-grounded semantic search
      contentVector: 'vector(1536)', 
      s3PdfUri: 'varchar(255)',
      extractedBiomarkers: 'jsonb',
      createdAt: 'timestamp with time zone DEFAULT now()'
    },
    indexes: [
      'CREATE INDEX idx_documents_patient ON clinical_documents(patientId)',
      'CREATE INDEX idx_documents_vector ON clinical_documents USING hnsw (contentVector vector_cosine_ops)'
    ]
  },

  // 5. Clinical Trial Protocols & Structured Criteria
  protocols: {
    tableName: 'protocols',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      nctId: 'varchar(32) NOT NULL UNIQUE',
      protocolNumber: 'varchar(64) NOT NULL UNIQUE',
      title: 'text NOT NULL',
      shortTitle: 'varchar(128) NOT NULL',
      indication: 'text NOT NULL',
      phase: 'varchar(32) NOT NULL',
      sponsor: 'varchar(128) NOT NULL',
      principalInvestigator: 'varchar(128) NOT NULL',
      targetEnrollment: 'integer NOT NULL',
      currentEnrolled: 'integer DEFAULT 0',
      status: 'varchar(32) DEFAULT "RECRUITING"',
      rawProtocolText: 'text',
      createdAt: 'timestamp with time zone DEFAULT now()'
    }
  },

  criteriaRules: {
    tableName: 'criteria_rules',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      protocolId: 'uuid REFERENCES protocols(id) ON DELETE CASCADE NOT NULL',
      type: 'varchar(16) NOT NULL', // 'INCLUSION', 'EXCLUSION'
      category: 'varchar(32) NOT NULL', // 'DEMOGRAPHICS', 'LABORATORY', 'CONDITION', 'MEDICATION', 'CLINICAL_NOTE'
      name: 'varchar(255) NOT NULL',
      description: 'text NOT NULL',
      operator: 'varchar(32) NOT NULL', // '>=', '<=', 'BETWEEN', 'EXISTS', etc.
      thresholdValue: 'double precision',
      thresholdRangeMin: 'double precision',
      thresholdRangeMax: 'double precision',
      thresholdString: 'varchar(128)',
      systemName: 'varchar(32)',
      systemCode: 'varchar(64)',
      expectedUnit: 'varchar(32)',
      timeWindowDays: 'integer',
      requiredForEligibility: 'boolean DEFAULT true NOT NULL'
    },
    indexes: ['CREATE INDEX idx_criteria_protocol ON criteria_rules(protocolId)']
  },

  // 6. Screening Results & Auditable Evidence Grounding
  evaluations: {
    tableName: 'evaluations',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      patientId: 'uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL',
      protocolId: 'uuid REFERENCES protocols(id) ON DELETE CASCADE NOT NULL',
      overallStatus: 'varchar(32) NOT NULL', // 'ELIGIBLE', 'INELIGIBLE', 'NEEDS_REVIEW'
      matchScore: 'integer NOT NULL',
      inclusionsMetCount: 'integer NOT NULL',
      inclusionsTotalCount: 'integer NOT NULL',
      exclusionsTriggeredCount: 'integer NOT NULL',
      exclusionsTotalCount: 'integer NOT NULL',
      blockerReasons: 'jsonb NOT NULL DEFAULT "[]"',
      reviewStatus: 'varchar(32) DEFAULT "PENDING"',
      reviewedBy: 'varchar(128)',
      reviewedAt: 'timestamp with time zone',
      evaluatedAt: 'timestamp with time zone DEFAULT now() NOT NULL'
    },
    indexes: ['CREATE INDEX idx_evaluations_patient_protocol ON evaluations(patientId, protocolId)']
  },

  // 7. Regulatory & Physician Audit Trails (HIPAA / 21 CFR Part 11)
  clinicalAuditLogs: {
    tableName: 'clinical_audit_logs',
    columns: {
      id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      actorName: 'varchar(128) NOT NULL',
      actorRole: 'varchar(64) NOT NULL', // 'Principal Investigator', 'Clinical Research Coordinator'
      actionType: 'varchar(64) NOT NULL', // 'CLINICAL_OVERRIDE', 'PHYSICIAN_SIGN_OFF', 'OUTREACH_SENT'
      patientId: 'uuid REFERENCES patients(id) ON DELETE SET NULL',
      protocolId: 'uuid REFERENCES protocols(id) ON DELETE SET NULL',
      details: 'text NOT NULL',
      previousStatus: 'varchar(32)',
      newStatus: 'varchar(32)',
      overrideReason: 'text',
      timestamp: 'timestamp with time zone DEFAULT now() NOT NULL'
    },
    indexes: ['CREATE INDEX idx_audit_patient ON clinical_audit_logs(patientId)', 'CREATE INDEX idx_audit_timestamp ON clinical_audit_logs(timestamp DESC)']
  }
};

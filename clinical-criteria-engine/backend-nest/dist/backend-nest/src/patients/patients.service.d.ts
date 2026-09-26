import { QueryPatientsDto, IngestFhirPatientDto } from './patients.dto';
import { FHIRPatientRecord } from '../../../src/types/fhir';
export declare class PatientsService {
    findAll(queryDto: QueryPatientsDto): Promise<{
        success: boolean;
        total: number;
        patients: {
            id: string;
            mrn: string;
            name: string;
            gender: "male" | "female" | "other" | "unknown";
            birthDate: string;
            ehrSource: "Epic" | "athenahealth" | "eClinicalWorks" | "OncoEMR";
            conditionCount: number;
            observationCount: number;
            documentCount: number;
            lastSynced: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        record: FHIRPatientRecord;
    }>;
    ingest(dto: IngestFhirPatientDto): Promise<{
        success: boolean;
        message: string;
        patientId: string;
    }>;
}

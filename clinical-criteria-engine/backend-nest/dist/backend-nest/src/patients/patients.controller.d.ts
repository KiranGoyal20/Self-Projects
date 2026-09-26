import { PatientsService } from './patients.service';
import { QueryPatientsDto, IngestFhirPatientDto } from './patients.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    findAll(query: QueryPatientsDto): Promise<{
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
        record: import("@/types/fhir").FHIRPatientRecord;
    }>;
    ingest(dto: IngestFhirPatientDto): Promise<{
        success: boolean;
        message: string;
        patientId: string;
    }>;
}

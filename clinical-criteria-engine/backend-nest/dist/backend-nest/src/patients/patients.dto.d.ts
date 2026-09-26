export declare class QueryPatientsDto {
    ehrSource?: string;
    mrn?: string;
    query?: string;
}
export declare class IngestFhirPatientDto {
    patient: any;
    conditions?: any[];
    observations?: any[];
    medications?: any[];
    documents?: any[];
    ehrSource?: 'Epic' | 'athenahealth' | 'eClinicalWorks' | 'OncoEMR';
}

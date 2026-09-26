export declare class CreateProtocolDto {
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
    criteria: any[];
}

import { EvaluateCriteriaDto, ParseProtocolDto } from './criteria.dto';
export declare class CriteriaService {
    evaluate(dto?: EvaluateCriteriaDto): Promise<{
        success: boolean;
        timestamp: string;
        evaluation: import("@/types/protocol").PatientTrialEvaluation;
    }>;
    parseProtocol(dto: ParseProtocolDto): Promise<{
        success: boolean;
        extractedCount: number;
        criteria: import("@/types/protocol").CriterionRule[];
        timestamp: string;
    }>;
}

import { CriteriaService } from './criteria.service';
import { EvaluateCriteriaDto, ParseProtocolDto } from './criteria.dto';
export declare class CriteriaController {
    private readonly criteriaService;
    constructor(criteriaService: CriteriaService);
    evaluateCriteria(dto: EvaluateCriteriaDto): Promise<{
        success: boolean;
        timestamp: string;
        evaluation: import("@/types/protocol").PatientTrialEvaluation;
    }>;
    getSampleEvaluateCriteria(): Promise<{
        success: boolean;
        timestamp: string;
        evaluation: import("@/types/protocol").PatientTrialEvaluation;
    }>;
    evaluateAlias(dto: EvaluateCriteriaDto): Promise<{
        success: boolean;
        timestamp: string;
        evaluation: import("@/types/protocol").PatientTrialEvaluation;
    }>;
    getSampleEvaluateAlias(): Promise<{
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

import { EhrService } from './ehr.service';
import { TriggerSyncDto } from './ehr.dto';
export declare class EhrController {
    private readonly ehrService;
    constructor(ehrService: EhrService);
    getStatus(): Promise<{
        success: boolean;
        connectors: import("@/types/ehr").EHRConnectorStatus[];
        recentJobs: import("@/types/ehr").IngestionJob[];
        timestamp: string;
    }>;
    triggerSync(dto: TriggerSyncDto): Promise<{
        success: boolean;
        message: string;
        job: import("@/types/ehr").IngestionJob;
    }>;
}

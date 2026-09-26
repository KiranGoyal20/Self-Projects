import { TriggerSyncDto } from './ehr.dto';
import { IngestionJob } from '../../../src/types/ehr';
export declare class EhrService {
    getStatus(): Promise<{
        success: boolean;
        connectors: import("../../../src/types/ehr").EHRConnectorStatus[];
        recentJobs: IngestionJob[];
        timestamp: string;
    }>;
    triggerSync(dto: TriggerSyncDto): Promise<{
        success: boolean;
        message: string;
        job: IngestionJob;
    }>;
}

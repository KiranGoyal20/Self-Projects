import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './protocols.dto';
export declare class ProtocolsController {
    private readonly protocolsService;
    constructor(protocolsService: ProtocolsService);
    findAll(): Promise<{
        success: boolean;
        count: number;
        protocols: import("@/types/protocol").TrialProtocol[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        protocol: import("@/types/protocol").TrialProtocol;
    }>;
    create(dto: CreateProtocolDto): Promise<{
        success: boolean;
        message: string;
        protocol: import("@/types/protocol").TrialProtocol;
    }>;
}

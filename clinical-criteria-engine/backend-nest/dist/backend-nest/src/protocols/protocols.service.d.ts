import { CreateProtocolDto } from './protocols.dto';
import { TrialProtocol } from '../../../src/types/protocol';
export declare class ProtocolsService {
    findAll(): Promise<{
        success: boolean;
        count: number;
        protocols: TrialProtocol[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        protocol: TrialProtocol;
    }>;
    create(dto: CreateProtocolDto): Promise<{
        success: boolean;
        message: string;
        protocol: TrialProtocol;
    }>;
}

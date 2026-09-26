import { Module } from '@nestjs/common';
import { CriteriaModule } from './criteria/criteria.module';
import { PatientsModule } from './patients/patients.module';
import { ProtocolsModule } from './protocols/protocols.module';
import { EhrModule } from './ehr/ehr.module';

@Module({
  imports: [
    CriteriaModule,
    PatientsModule,
    ProtocolsModule,
    EhrModule,
  ],
})
export class AppModule {}

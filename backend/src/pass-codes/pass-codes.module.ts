import {
  // common
  Module,
} from '@nestjs/common';
import { PassCodesService } from './pass-codes.service';
import { PassCodesController } from './pass-codes.controller';
import { RelationalPassCodePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalPassCodePersistenceModule,
  ],
  controllers: [PassCodesController],
  providers: [PassCodesService],
  exports: [PassCodesService, RelationalPassCodePersistenceModule],
})
export class PassCodesModule {}

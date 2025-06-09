import { Module } from '@nestjs/common';
import { PassCodeRepository } from '../pass-code.repository';
import { PassCodeRelationalRepository } from './repositories/pass-code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassCodeEntity } from './entities/pass-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassCodeEntity])],
  providers: [
    {
      provide: PassCodeRepository,
      useClass: PassCodeRelationalRepository,
    },
  ],
  exports: [PassCodeRepository],
})
export class RelationalPassCodePersistenceModule {}

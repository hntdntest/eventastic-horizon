// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePassCodeDto } from './create-pass-code.dto';

export class UpdatePassCodeDto extends PartialType(CreatePassCodeDto) {}

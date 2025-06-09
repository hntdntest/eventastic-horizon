import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PassCodesService } from './pass-codes.service';
import { CreatePassCodeDto } from './dto/create-pass-code.dto';
import { UpdatePassCodeDto } from './dto/update-pass-code.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PassCode } from './domain/pass-code';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPassCodesDto } from './dto/find-all-pass-codes.dto';

@ApiTags('Passcodes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'pass-codes',
  version: '1',
})
export class PassCodesController {
  constructor(private readonly passCodesService: PassCodesService) {}

  @Post()
  @ApiCreatedResponse({
    type: PassCode,
  })
  create(@Body() createPassCodeDto: CreatePassCodeDto) {
    return this.passCodesService.create(createPassCodeDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PassCode),
  })
  async findAll(
    @Query() query: FindAllPassCodesDto,
  ): Promise<InfinityPaginationResponseDto<PassCode>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.passCodesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PassCode,
  })
  findById(@Param('id') id: number) {
    return this.passCodesService.findById(id);
  }

  @Get('email/:email')
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PassCode,
  })
  findByEmail(@Param('email') email: string) {
    return this.passCodesService.findByEmail(email);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PassCode,
  })
  update(
    @Param('id') id: number,
    @Body() updatePassCodeDto: UpdatePassCodeDto,
  ) {
    return this.passCodesService.update(id, updatePassCodeDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.passCodesService.remove(id);
  }
}

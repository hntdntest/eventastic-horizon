import {
  // decorators here

  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsObject,
} from "class-validator";

import {
  // decorators here
  ApiProperty,
} from "@nestjs/swagger";

import {
  // decorators here

  Type,
} from "class-transformer";

export class CreateSpeakerDto {
  @IsString()
  name: string;
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  bio?: string;
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class CreateSponsorDto {
  @IsString()
  name: string;
  @IsString()
  level: string;
  @IsString()
  @IsOptional()
  website?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class CreateBoothDto {
  @IsString()
  name: string;
  @IsString()
  company: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  location?: string;
  @IsString()
  @IsOptional()
  coverImageUrl?: string;
}

export class CreateTicketTypeDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  price: number;
  @IsNumber()
  quantity: number;
  @IsDateString()
  @IsOptional()
  saleStartDate?: string;
  @IsDateString()
  @IsOptional()
  saleEndDate?: string;
  @IsBoolean()
  @IsOptional()
  isEarlyBird?: boolean;
  @IsNumber()
  @IsOptional()
  earlyBirdDiscount?: number;
  @IsBoolean()
  @IsOptional()
  isVIP?: boolean;
  @IsString()
  @IsOptional()
  category?: string;
}

export class CreateActivityDto {
  @ApiProperty({
    required: true,
    type: Object,
    example: { en: "Activity title", vi: "Tiêu đề hoạt động" },
  })
  @IsObject()
  title: Record<string, string>;
  @ApiProperty({
    required: false,
    type: Object,
    example: { en: "Activity description", vi: "Mô tả hoạt động" },
  })
  @IsObject()
  @IsOptional()
  description?: Record<string, string>;
  @IsString()
  startTime: string;
  @IsString()
  endTime: string;
  @IsString()
  type: string;
  @IsString()
  @IsOptional()
  location?: string;
  @IsArray()
  @IsOptional()
  speakerIds?: string[];
}

export class CreateEventDayDto {
  @IsDateString()
  date: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  activities: CreateActivityDto[];
}

export class CreateEventDto {
  @ApiProperty({
    required: true,
    type: Object,
    example: { en: "Event description", vi: "Mô tả sự kiện" },
  })
  @IsObject()
  description: Record<string, string>;

  @ApiProperty({
    required: true,
    type: Object,
    example: { en: "Event title", vi: "Tiêu đề sự kiện" },
  })
  @IsObject()
  title: Record<string, string>;

  @ApiProperty({
    required: false,
    type: String,
    example: "conference",
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    required: false,
    type: Object,
    example: { en: "Location", vi: "Địa điểm" },
  })
  @IsObject()
  @IsOptional()
  location?: Record<string, string>;
  @IsDateString()
  @IsOptional()
  startDate?: string;
  @IsDateString()
  @IsOptional()
  endDate?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDayDto)
  days: CreateEventDayDto[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpeakerDto)
  speakers: CreateSpeakerDto[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSponsorDto)
  sponsors: CreateSponsorDto[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBoothDto)
  booths: CreateBoothDto[];
  @IsBoolean()
  isFreeEvent: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  ticketTypes: CreateTicketTypeDto[];
  @IsArray()
  @IsOptional()
  media?: string[];
  @IsString()
  @IsOptional()
  coverImage?: string;
  @ApiProperty({
    required: false,
    type: Object,
    description: "Tab configuration for this event",
    example: { tickets: true, speakers: false },
  })
  @IsOptional()
  tabConfig?: Record<string, boolean>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eventType?: string;

  @IsArray()
  @IsOptional()
  ticketCategories?: string[];
  // Don't forget to use the class-validator decorators in the DTO properties.
}

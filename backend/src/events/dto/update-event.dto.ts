// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateEventDto } from "./create-event.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // media, coverImage, ticketCategories đã được kế thừa từ CreateEventDto qua PartialType, không cần bổ sung thêm.
}

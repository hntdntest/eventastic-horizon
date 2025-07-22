import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "../controller/category.controller";
import { CategoryService } from "../service/category.service";
import { CategoryEntity } from "../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule], // Export both service and TypeOrmModule
})
export class CategoryModule {}

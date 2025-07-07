import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll() {
    return this.categoryRepo.find();
  }

  async create(name: string) {
    const cat = this.categoryRepo.create({ name });
    return this.categoryRepo.save(cat);
  }

  async update(id: string, name: string) {
    const cat = await this.categoryRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category not found');
    cat.name = name;
    return this.categoryRepo.save(cat);
  }

  async remove(id: string) {
    const cat = await this.categoryRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(cat);
    return { success: true };
  }
}

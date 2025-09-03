import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Class } from './class.entity';
import { Sport } from 'src/sport/sport.entity';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  async create(dto: CreateClassDto) {
    const sport = await this.sportRepository.findOneBy({ id: dto.sportId });
    if (!sport) {
      throw new NotFoundException(`Sport with id ${dto.sportId} not found`);
    }

    const newClass = this.classRepository.create({
      title: dto.title,
      description: dto.description,
      duration: dto.duration,
      sport, 
    });

    return this.classRepository.save(newClass);
  }

  async findOneSpecific(classes?: string[]) {
    if (classes) {
      return this.classRepository.find({ where: { title: In(classes) } });
    }
    return this.classRepository.find();
  }

  findAll() {
    return this.classRepository.find();
  }

  async findOne(id: string) {
    const cls = await this.classRepository.findOne({ where: { id }, relations: ['sport'] });
    if (!cls) throw new NotFoundException(`Class with id ${id} not found`);
    return cls;
  }

  async update(id: string, data: Partial<Class> & { sportId?: string }) {
    const cls = await this.findOne(id);

    let sport;
    if (data.sportId) {
      sport = await this.sportRepository.findOneBy({ id: data.sportId });
      if (!sport) throw new NotFoundException(`Sport with id ${data.sportId} not found`);
    }

    if (sport) cls.sport = sport;
    if (data.title !== undefined) cls.title = data.title;
    if (data.description !== undefined) cls.description = data.description;
    if (data.duration !== undefined) cls.duration = data.duration;

    return this.classRepository.save(cls);
  }

  async remove(id: string) {
    const cls = await this.findOne(id);
    return this.classRepository.remove(cls);
  }
}

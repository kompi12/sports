// src/classes/class-schedule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSchedule } from './class-schedule.entity';
import { Class } from 'src/classes/class.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(className: string, scheduleData: Partial<ClassSchedule>) {
    const cls = await this.classRepository.findOneBy({ title: className });
    if (!cls) {
      throw new NotFoundException(`Class with name ${className} not found`);
    }

    const schedule = this.scheduleRepository.create({
      ...scheduleData,
      class: cls, 
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll() {
    return this.scheduleRepository.find({ relations: ['class'] });
  }

  async findByClass(className: string) {
    return this.scheduleRepository.find({
      where: { class: { title: className } },
      relations: ['class'],
    });
  }

  async remove(scheduleId: string) {
    const schedule = await this.scheduleRepository.findOneBy({ id: scheduleId });
    if (!schedule) throw new NotFoundException(`Schedule not found`);
    return this.scheduleRepository.remove(schedule);
  }
}

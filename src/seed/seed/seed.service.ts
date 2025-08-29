// src/seed/seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Sport } from 'src/sport/sport.entity';
import { Class } from 'src/classes/class.entity';
import { ClassSchedule, DayOfWeek } from 'src/class-schedule/class-schedule.entity';
import { Application, ApplicationStatus } from 'src/application/application.entity';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,

    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async run() {
await this.applicationRepository.query('TRUNCATE TABLE "application" CASCADE');
await this.classScheduleRepository.query('TRUNCATE TABLE "class_schedule" CASCADE');
await this.classRepository.query('TRUNCATE TABLE "class" CASCADE');
await this.sportRepository.query('TRUNCATE TABLE "sport" CASCADE');
await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');



    const users = await this.userRepository.save([
      { email: 'admin@gmail.com', password: 'password', role: 'admin' },
      { email: 'user1@gmail.com', password: 'password', role: 'user' },
      { email: 'user2@gmail.com', password: 'password', role: 'user' },
    ]);

    const sports = await this.sportRepository.save([
      {
        name: 'Football',
        description:
          'Football is a family of team sports that involve, to varying degrees, kicking a ball to score a goal.',
      },
      {
        name: 'Basketball',
        description:
          'Basketball is a team sport in which two teams of five players compete to score points by shooting a ball through a hoop.',
      },
    ]);

    const classes = await this.classRepository.save([
      {
        sport: sports[0], 
        title: 'Beginner Football Training',
        description: 'Introduction to football basics',
        duration: 90,
      },
      {
        sport: sports[1], 
        title: 'Basketball Drills',
        description: 'Ball handling and shooting practice',
        duration: 120,
      },
    ]);

    await this.classScheduleRepository.save([
      {
        class: classes[0],
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '10:00',
        endTime: '11:30',
      },
      {
        class: classes[1],
        dayOfWeek: DayOfWeek.WEDNESDAY,
        startTime: '14:00',
        endTime: '16:00',
      },
    ]);

    await this.applicationRepository.save([
      {
        user: users[1], 
        class: classes[0], 
        status: ApplicationStatus.PENDING,
      },
      {
        user: users[2], 
        class: classes[1], 
        status: ApplicationStatus.APPROVED,
      },
    ]);

    console.log('✅ Database seeded successfully!');
  }
}

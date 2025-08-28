import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './class.entity';
import { Sport } from 'src/sport/sport.entity';
import { ApplicationController } from 'src/application/application.controller';
import { Application } from 'src/application/application.entity';
import { ApplicationService } from 'src/application/application.service';
import { ClassScheduleController } from 'src/class-schedule/class-schedule.controller';
import { ClassSchedule } from 'src/class-schedule/class-schedule.entity';
import { ClassScheduleService } from 'src/class-schedule/class-schedule.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      Sport,
      ClassSchedule,
      Application,
      User, // <- THIS IS REQUIRED for UserRepository injection
    ]),
  ],
  controllers: [
    ClassesController,
    ClassScheduleController,
    ApplicationController,
  ],
  providers: [
    ClassesService,
    ClassScheduleService,
    ApplicationService,
  ],
})
export class ClassesModule {}
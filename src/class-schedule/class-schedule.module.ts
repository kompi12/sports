import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/application.entity';
import { Class } from 'src/classes/class.entity';
import { Sport } from 'src/sport/sport.entity';
import { ClassScheduleController } from './class-schedule.controller';
import { ClassSchedule } from './class-schedule.entity';
import { ClassScheduleService } from './class-schedule.service';


@Module({
       imports: [TypeOrmModule.forFeature([Class, Sport,Application,ClassSchedule])],
  
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService]
})
export class ClassScheduleModule {}

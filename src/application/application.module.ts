import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/classes/class.entity';
import { Sport } from 'src/sport/sport.entity';
import { Application } from './application.entity';
import { ClassSchedule } from 'src/class-schedule/class-schedule.entity';
import { User } from 'src/users/user.entity';

@Module({
     imports: [TypeOrmModule.forFeature([Class, Sport,Application,ClassSchedule,User])],

  controllers: [ApplicationController],
  providers: [ApplicationService]
})
export class ApplicationModule {}

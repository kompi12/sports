import { Module } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/application.entity';
import { ClassSchedule } from 'src/class-schedule/class-schedule.entity';
import { Class } from 'src/classes/class.entity';
import { Sport } from 'src/sport/sport.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sport, Class, ClassSchedule, Application]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

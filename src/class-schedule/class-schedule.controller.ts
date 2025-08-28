// src/classes/class-schedule.controller.ts
import { Controller, Post, Get, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { ClassSchedule, DayOfWeek } from './class-schedule.entity';

@ApiTags('class-schedules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('class-schedules')
export class ClassScheduleController {
  constructor(private readonly scheduleService: ClassScheduleService) {}

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Post()
  @Roles('admin')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['classId', 'dayOfWeek', 'startTime', 'endTime'],
      properties: {
        className: { type: 'string',  example: 'Beginner Football Training' },
        dayOfWeek: { type: 'string', enum: Object.values(DayOfWeek) },
        startTime: { type: 'string', example: '18:00' },
        endTime: { type: 'string', example: '19:00' },
        weekStart: { type: 'string', format: 'date' },
        weekEnd: { type: 'string', format: 'date' },
      },
    },
  })
create(@Body() body: { className: string } & Partial<ClassSchedule>) {
  const { className, ...scheduleData } = body;
  return this.scheduleService.create(className, scheduleData);
}


  // Get all schedules for a given class
  @Get('class/:classId')
  findByClass(@Param('classId') className: string) {
    return this.scheduleService.findByClass(className);
  }

  // Delete a schedule (admin only)
  @Delete(':scheduleId')
  @Roles('admin')
  remove(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.remove(scheduleId);
  }
}

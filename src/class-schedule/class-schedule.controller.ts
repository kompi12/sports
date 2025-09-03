import { Controller, Post, Get, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ClassSchedule, DayOfWeek } from './class-schedule.entity';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';

@ApiTags('class-schedules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('class-schedules')
export class ClassScheduleController {
  constructor(private readonly scheduleService: ClassScheduleService) { }

  @Get()
  @ApiOkResponse({ description: 'Retrieved all class schedules successfully.', type: [ClassSchedule] })
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
        classId: { type: 'string', example: 'Beginner Football Training' },
        dayOfWeek: { type: 'string', enum: Object.values(DayOfWeek) },
        startTime: { type: 'string', example: '18:00' },
        endTime: { type: 'string', example: '19:00' },
        weekStart: { type: 'string', format: 'date' },
        weekEnd: { type: 'string', format: 'date' },
      },
    },
  })

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden – admin only' })
  @ApiCreatedResponse({ description: 'Class schedule created successfully.', type: ClassSchedule })
  @ApiNotFoundResponse({ description: 'Class with given id not found.' })
  create(@Body() dto: CreateClassScheduleDto) {
    const { classId, ...scheduleData } = dto;
    return this.scheduleService.create(classId, scheduleData);
  }



  @Get('/:classId')
  @ApiOkResponse({ description: 'Retrieved all schedules for a class successfully.', type: [ClassSchedule] })
  @ApiNotFoundResponse({ description: 'Class not found or has no schedules.' })
  findByClass(@Param('classId') classId: string) {
    return this.scheduleService.findByClass(classId);
  }

  @Delete(':scheduleId')
  @Roles('admin')
  @ApiOkResponse({ description: 'Class schedule deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Schedule not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized – invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Forbidden – admin only' })
  remove(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.remove(scheduleId);
  }
}



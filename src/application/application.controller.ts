// src/classes/application.controller.ts
import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { ApplicationStatus } from './application.entity';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':classId')
  @Roles('user')
  apply(@Param('classId') classId: string, @Body('userId') userId: string) {
    return this.applicationService.apply(userId, classId);
  }

  @Get(':classId')
  @Roles('admin')
  findByClass(@Param('classId') classId: string) {
    return this.applicationService.findByClass(classId);
  }

  @Patch(':applicationId')
  @Roles('admin')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: Object.values(ApplicationStatus) },
      },
    },
  })
  updateStatus(@Param('applicationId') applicationId: string, @Body('status') status: ApplicationStatus) {
    return this.applicationService.updateStatus(applicationId, status);
  }
}

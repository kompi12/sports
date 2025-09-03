// src/classes/application.controller.ts
import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ApplicationStatus } from './application.entity';
import { ApplyDto } from './dto/apply.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Post(':classId')
  @Roles('user')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Application submitted successfully.' })
  @ApiNotFoundResponse({ description: 'Class or user not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized – invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Forbidden – requires user role' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  apply(@Param('classId') classId: string, @Body() dto: ApplyDto) {
  return this.applicationService.apply(dto.userId, classId);
}

  @Get(':class/classId')
  @Roles('admin')
  @Roles('admin')
  @ApiOkResponse({ description: 'Applications retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Class not found or has no applications.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden – requires admin role' })
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
  @ApiOkResponse({ description: 'Application status updated successfully.' })
  @ApiNotFoundResponse({ description: 'Application not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden – requires admin role' })
  @ApiBadRequestResponse({ description: 'Invalid status provided.' })
updateStatus(@Param('applicationId') applicationId: string, @Body() dto: UpdateApplicationStatusDto) {
  return this.applicationService.updateStatus(applicationId, dto.status);
}
}

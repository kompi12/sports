import { Controller, Get, Param, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Sport } from './sport.entity';
import { ClassesService } from 'src/classes/classes.service';
import { SportService } from './sport.service';

@ApiTags('sport') 
@ApiBearerAuth()    // Shows padlock & token field in Swagger
@UseGuards(AuthGuard('jwt'), RolesGuard) // 🔒 All routes need JWT + roles
@Controller('sport')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  findAll(@Query('sport') sports?: string) {
    const sportsArray = sports ? sports.split(',') : undefined;
    return this.sportService.findAll(sportsArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['sport', 'description', 'duration', 'schedule'],
      properties: {
        sport: { type: 'string', example: 'Basketball' },
        description: { type: 'string', example: '3x per week training' },
           },
    },
  })
  create(@Body() body: Partial<Sport>) {
    return this.sportService.create(body);
  }

}

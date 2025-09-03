import { Controller, Get, Param, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { SportService } from './sport.service';
import { Sport } from './sport.entity';
import { CreateSportDto } from './dto/create-sport.dto';

@ApiTags('sports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  @ApiOkResponse({ description: 'Retrieved all sports successfully.', type: [Sport] })
  findAll(@Query('sport') sports?: string) {
    const sportsArray = sports ? sports.split(',') : undefined;
    return this.sportService.findAll(sportsArray);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Retrieved sport successfully.', type: Sport })
  @ApiNotFoundResponse({ description: 'Sport not found.' })
  findOne(@Param('id') id: string) {
    return this.sportService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiCreatedResponse({ description: 'Sport created successfully.', type: Sport })
  @ApiUnauthorizedResponse({ description: 'Unauthorized – invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Forbidden – admin only' })
  create(@Body() dto: CreateSportDto) {
    return this.sportService.create(dto);
  }
}

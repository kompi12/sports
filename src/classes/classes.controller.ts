import { Controller, Get, Param, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Class } from './class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';

@ApiTags('classes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOkResponse({ description: 'Retrieved all classes successfully.', type: [Class] })
  findAll() {
    return this.classesService.findAll();
  }

  @Get('/search')
  @ApiOkResponse({ description: 'Retrieved classes matching search successfully.', type: [Class] })
  findOneSpecific(@Query('class') classes?: string) {
    const classesArray = classes ? classes.split(',') : undefined;
    return this.classesService.findOneSpecific(classesArray);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Retrieved class details successfully.', type: Class })
  @ApiNotFoundResponse({ description: 'Class with given ID not found.' })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiCreatedResponse({ description: 'Class created successfully.', type: Class })
  @ApiNotFoundResponse({ description: 'Sport not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized – invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Forbidden – admin only' })
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }
}

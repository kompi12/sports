import { Controller, Get, Param, Query, Post, Body, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Class } from './class.entity';

@ApiTags('classes')
@ApiBearerAuth() // Shows padlock & token field isn Swagger
@UseGuards(AuthGuard('jwt'), RolesGuard) // 🔒 All routes need JWT + roles
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

 @Get('/filter') 
findOneSpecific(@Query('class') classes?: string) {
  const classesArray = classes ? classes.split(',') : undefined;
  return this.classesService.findOneSpecific(classesArray);
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.classesService.findOne(id);
}

  @Post()
  @Roles('admin')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['sport', 'description', 'duration', 'schedule'],
      properties: {
        sport: { type: 'string', example: 'Basketball' },
        title: { type: 'string', example: 'Intermediate Training' },
        description: { type: 'string', example: '3x per week training' },
        duration: { type: 'number', example: 60 },
      },
    },
  })
  create(@Body() body: Partial<Class>) {
    return this.classesService.create(body);
  }
}

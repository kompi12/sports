// src/classes/dto/create-class-schedule.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../class-schedule.entity';

export class CreateClassScheduleDto {
  @ApiProperty({ example: 'uuid-of-class', description: 'ID of the class' })
  @IsString()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({ enum: DayOfWeek, description: 'Day of the week' })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '18:00', description: 'Start time in HH:mm format' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime must be HH:mm' })
  startTime: string;

  @ApiProperty({ example: '19:00', description: 'End time in HH:mm format' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be HH:mm' })
  endTime: string;

  @ApiProperty({ example: '2025-09-01', description: 'Optional week start date', required: false })
  @IsOptional()
  weekStart?: string;

  @ApiProperty({ example: '2025-09-07', description: 'Optional week end date', required: false })
  @IsOptional()
  weekEnd?: string;
}

import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
@ApiProperty({ description: 'ID of the sport', example: 'uuid-of-sport' })
@IsString()
@IsNotEmpty()
sportId: string;


  @ApiProperty({ description: 'Class title', example: 'Intermediate Training' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Class description', example: '3x per week training' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Class duration in minutes', example: 60 })
  @IsNumber()
  @Min(1)
  duration: number;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
  @ApiProperty({ description: 'Name of the sport', example: 'Basketball' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the sport', example: '3x per week training' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

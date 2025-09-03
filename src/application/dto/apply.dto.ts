// src/classes/dto/apply.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
export class ApplyDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

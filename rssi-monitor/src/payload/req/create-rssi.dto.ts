import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateRssiDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  rssiLevel: number;

  @IsDateString()
  timestamp: string;
}

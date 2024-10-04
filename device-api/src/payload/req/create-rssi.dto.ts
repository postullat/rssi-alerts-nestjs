import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRssiDto {
  @ApiProperty({
    description: 'The unique identifier of the device',
    example: 'device1234',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description:
      'The RSSI (Received Signal Strength Indicator) level of the device',
    example: -85,
  })
  @IsNumber()
  rssiLevel: number;

  @ApiProperty({
    description: 'The timestamp when the RSSI data was collected',
    example: '2024-10-04T10:23:12Z',
  })
  @IsDateString()
  timestamp: string;
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateRssiDto } from '../payload/req/create-rssi.dto';
import { ProducerService } from '../producer/producer.service';

@ApiTags('RSSI Service') // Group the controller in Swagger under this tag
@Controller('rssi-service')
export class RssiController {
  private readonly rssiTopic: string;

  constructor(private readonly kafkaService: ProducerService) {
    this.rssiTopic = process.env.KAFKA_RSSI_TOPIC || 'rssi-service-topic';
  }

  @Post()
  @ApiOperation({ summary: 'Create RSSI data and publish to Kafka' }) // Operation summary
  @ApiBody({
    description: 'The RSSI data to be sent to the Kafka topic',
    type: CreateRssiDto, // Link to the DTO for request body
  })
  async createRssi(@Body() createRssiDto: CreateRssiDto) {
    const { deviceId, rssiLevel, timestamp } = createRssiDto;

    // Publish RSSI data to Kafka
    await this.kafkaService.sendMessage(this.rssiTopic, {
      deviceId,
      rssiLevel,
      timestamp,
    });

    return {
      message: 'RSSI data received and pushed to Kafka',
      data: {
        deviceId,
        rssiLevel,
        timestamp,
      },
    };
  }
}

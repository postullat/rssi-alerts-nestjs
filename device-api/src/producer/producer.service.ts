import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Transport, Client } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CreateRssiDto } from '../payload/req/create-rssi.dto';

@Injectable()
export class ProducerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId:
          process.env.KAFKA_CLIENT_ID || 'rssi-service-producer-service',
        brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
      },
      producer: {
        allowAutoTopicCreation: false,
      },
    },
  })
  private readonly kafkaClient: ClientKafka;

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sendMessage(
    topic: string = 'rssi-service-topic',
    message: CreateRssiDto,
  ) {
    return this.kafkaClient.emit(topic, message);
  }
}

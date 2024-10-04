import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka, Transport, Client } from '@nestjs/microservices';
import { CreateRssiDto } from '../payload/req/create-rssi.dto';
import { RssiService } from './rssi.service';

@Injectable()
export class RssiConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RssiConsumerService.name);
  private readonly rssiTopic: string;

  constructor(private readonly rssiService: RssiService) {
    this.rssiTopic = process.env.KAFKA_RSSI_TOPIC || 'rssi-service-topic';
  }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId:
          process.env.KAFKA_CLIENT_ID || 'rssi-service-consumer-service',
        brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
      },
      consumer: {
        groupId: 'rssi-service-consumer-group', // Ensure this is unique for the consumer
      },
    },
  })
  private readonly kafkaClient: ClientKafka;

  async onModuleInit() {
    // Connect Kafka client when the module initializes
    await this.kafkaClient.connect();
    this.logger.log('Kafka Consumer Connected');

    // Subscribe to the topic 'rssi-service-topic'
    this.kafkaClient.subscribeToResponseOf(this.rssiTopic);
    this.logger.log('Subscribed to rssi-service-topic');
  }

  // Handle Kafka messages
  async listenToRssiTopic(payload: CreateRssiDto) {
    this.logger.log(
      `Received message from rssi-topic: ${JSON.stringify(payload)}`,
    );
    this.rssiService.processRssiData(payload);
  }
}

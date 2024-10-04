import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class AlertProducerService implements OnModuleInit {
  private readonly logger = new Logger(AlertProducerService.name);
  private readonly alertTopic: string;

  constructor() {
    // Load the Kafka topic name from .env
    this.alertTopic = process.env.KAFKA_ALERT_TOPIC || 'alert-topic';
  }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID || 'rssi-consumer-service', //todo: change it to more proper one
        brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
      },
      producer: {
        allowAutoTopicCreation: true, // Auto create topic if not already available
      },
    },
  })
  private readonly kafkaClient: ClientKafka;

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Kafka Producer Connected');
  }

  async sendAlert(deviceId: string, timestamp: number) {
    const alertPayload = { deviceId, timestamp };

    // Produce an alert message to the alert-topic
    await this.kafkaClient.emit(this.alertTopic, alertPayload);
    this.logger.log(`Alert sent for device ${deviceId} at ${timestamp}`);
  }
}

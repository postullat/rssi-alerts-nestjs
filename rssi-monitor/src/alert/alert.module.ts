import { Module } from '@nestjs/common';
import { AlertProducerService } from './alert-producer.service';

@Module({
  providers: [AlertProducerService],
  exports: [AlertProducerService],
})
export class AlertModule {}

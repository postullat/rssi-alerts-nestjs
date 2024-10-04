import { Module } from '@nestjs/common';
import { RssiService } from './rssi.service';
import { RssiConsumerService } from './rssi-consumer.service';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [AlertModule],
  providers: [RssiService, RssiConsumerService],
  exports: [RssiService, RssiConsumerService],
})
export class RssiModule {}

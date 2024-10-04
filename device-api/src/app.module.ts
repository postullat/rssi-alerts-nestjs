import { Module } from '@nestjs/common';
import { RssiController } from './rssi/rssi.controller';
import { ProducerModule } from './producer/producerModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the configuration available globally
    }),
    ProducerModule,
  ],
  controllers: [RssiController],
  providers: [],
})
export class AppModule {}

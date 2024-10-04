import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RssiModule } from './rssi/rssi.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RssiModule,
    AlertModule,
  ],
})
export class AppModule {}

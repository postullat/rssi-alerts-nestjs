import { Injectable } from '@nestjs/common';
import { CreateRssiDto } from '../payload/req/create-rssi.dto';
import * as process from 'node:process';
import { AlertProducerService } from '../alert/alert-producer.service';

@Injectable()
export class RssiService {
  private readonly rssiThreshold: number;
  private readonly offlineThresholdMinutes: number;
  private devicesMap: Map<string, Omit<CreateRssiDto, 'deviceId'>> = new Map();

  constructor(private readonly alertProducerService: AlertProducerService) {
    this.rssiThreshold = Number(process.env.RSSI_LEVEL_THRESHOLD) || -95;
    this.offlineThresholdMinutes =
      Number(process.env.RSSI_TIME_OFFLINE_THRESHOLD_MINUTES) * 60 * 1000 ||
      5 * 60 * 1000;
  }

  processRssiData(payload: CreateRssiDto) {
    const { deviceId, rssiLevel, timestamp } = payload;

    // Validate that deviceId, rssiLevel, and timestamp are valid
    if (
      !deviceId ||
      rssiLevel === null ||
      rssiLevel === undefined ||
      !timestamp
    ) {
      console.log(
        `Invalid data. Skipping processing: ${JSON.stringify(payload)}`,
      );
      return;
    }

    if (rssiLevel > this.rssiThreshold) {
      this.devicesMap.set(deviceId, { rssiLevel, timestamp });
      console.log(
        `Device ${deviceId} updated with RSSI: ${rssiLevel} at ${timestamp}`,
      );
    } else {
      if (this.isDeviceOffline(deviceId)) {
        this.alertProducerService.sendAlert(deviceId, Date.now());
      }
      console.log(
        `Device ${deviceId} RSSI level  ${rssiLevel} < ${this.rssiThreshold} therefore it is skipped`,
      );
    }
  }

  private isDeviceOffline(deviceId: string): boolean {
    const deviceData = this.devicesMap.get(deviceId);

    if (!deviceData) {
      // If the device doesn't exist in the map, consider it offline
      return true;
    }

    const deviceTimestamp = new Date(deviceData.timestamp).getTime(); // Get device's last known timestamp
    const currentTimestamp = Date.now(); // Get current timestamp

    const differenceInMs = currentTimestamp - deviceTimestamp; // Difference in milliseconds

    return differenceInMs > this.offlineThresholdMinutes;
  }
}

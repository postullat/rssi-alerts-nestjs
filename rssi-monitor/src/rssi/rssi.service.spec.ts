import { RssiService } from './rssi.service';
import { AlertProducerService } from '../alert/alert-producer.service';
import { CreateRssiDto } from '../payload/req/create-rssi.dto';

describe('RssiService', () => {
  let rssiService: RssiService;
  let alertProducerService: AlertProducerService;

  beforeEach(() => {
    alertProducerService = {
      sendAlert: jest.fn(), // Mock sendAlert method
    } as any;

    rssiService = new RssiService(alertProducerService);
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  // Positive Test Cases

  it('should add a device to devicesMap when RSSI is above threshold', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device1',
      rssiLevel: -50,
      timestamp: new Date().toISOString(),
    };

    rssiService.processRssiData(payload);

    expect(rssiService['devicesMap'].get('device1')).toEqual({
      rssiLevel: -50,
      timestamp: payload.timestamp,
    });
    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should send an alert when RSSI is below threshold and the device is offline', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device2',
      rssiLevel: -100,
      timestamp: new Date().toISOString(),
    };

    rssiService.processRssiData(payload);

    expect(alertProducerService.sendAlert).toHaveBeenCalledWith(
      'device2',
      expect.any(Number),
    );
  });

  it('should add a new device to devicesMap when RSSI is above threshold', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device3',
      rssiLevel: -60,
      timestamp: new Date().toISOString(),
    };

    rssiService.processRssiData(payload);

    expect(rssiService['devicesMap'].get('device3')).toEqual({
      rssiLevel: -60,
      timestamp: payload.timestamp,
    });
    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should send an alert for a new device when RSSI is below threshold and the device is offline', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device4',
      rssiLevel: -100,
      timestamp: new Date().toISOString(),
    };

    rssiService.processRssiData(payload);

    expect(alertProducerService.sendAlert).toHaveBeenCalledWith(
      'device4',
      expect.any(Number),
    );
  });

  it('should update an existing device in devicesMap when RSSI is above threshold', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device5',
      rssiLevel: -60,
      timestamp: new Date().toISOString(),
    };

    // Add device to devicesMap first
    rssiService['devicesMap'].set('device5', {
      rssiLevel: -70,
      timestamp: new Date().toISOString(),
    });

    rssiService.processRssiData(payload);

    expect(rssiService['devicesMap'].get('device5')).toEqual({
      rssiLevel: -60,
      timestamp: payload.timestamp,
    });
    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  // Negative Test Cases

  it('should not send an alert when RSSI is below threshold but the device is still online', () => {
    const timestamp = new Date().toISOString();
    const payload: CreateRssiDto = {
      deviceId: 'device6',
      rssiLevel: -90,
      timestamp,
    };

    rssiService['devicesMap'].set('device6', { rssiLevel: -80, timestamp });

    rssiService.processRssiData(payload);

    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should not send an alert when RSSI is below threshold and the device is not offline', () => {
    const payload: CreateRssiDto = {
      deviceId: 'device7',
      rssiLevel: -80,
      timestamp: new Date().toISOString(),
    };

    rssiService['devicesMap'].set('device7', {
      rssiLevel: -70,
      timestamp: new Date().toISOString(),
    });

    rssiService.processRssiData(payload);

    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should handle invalid RSSI value (null) without processing', () => {
    const payload = {
      deviceId: 'device8',
      rssiLevel: null, // Invalid RSSI
      timestamp: new Date().toISOString(),
    } as unknown as CreateRssiDto;

    rssiService.processRssiData(payload);

    expect(rssiService['devicesMap'].get('device8')).toBeUndefined();
    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should handle missing timestamp in payload without processing', () => {
    const payload = {
      deviceId: 'device9',
      rssiLevel: -70,
    } as unknown as CreateRssiDto;

    rssiService.processRssiData(payload);

    expect(rssiService['devicesMap'].get('device9')).toBeUndefined();
    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });

  it('should not process or send alert when deviceId is missing', () => {
    const payload = {
      rssiLevel: -80,
      timestamp: new Date().toISOString(),
    } as unknown as CreateRssiDto;

    rssiService.processRssiData(payload);

    expect(alertProducerService.sendAlert).not.toHaveBeenCalled();
  });
});

import { BLEManagerService } from './BLEManager';
import { BLE_SERVICES, BLE_CHARACTERISTICS, HeartRateReading } from '@peloton/shared';

export class HeartRateService {
  private bleManager: BLEManagerService;
  private deviceId: string | null = null;
  private onReadingCallback: ((reading: HeartRateReading) => void) | null = null;

  constructor(bleManager: BLEManagerService) {
    this.bleManager = bleManager;
  }

  async connect(
    deviceId: string,
    onReading: (reading: HeartRateReading) => void
  ): Promise<void> {
    await this.bleManager.connect(deviceId);
    this.deviceId = deviceId;
    this.onReadingCallback = onReading;

    await this.bleManager.subscribeToCharacteristic(
      deviceId,
      BLE_SERVICES.HEART_RATE,
      BLE_CHARACTERISTICS.HEART_RATE_MEASUREMENT,
      (bytes) => {
        const reading = this.parseHeartRateMeasurement(bytes);
        if (this.onReadingCallback) {
          this.onReadingCallback(reading);
        }
      }
    );
  }

  private parseHeartRateMeasurement(bytes: number[]): HeartRateReading {
    if (bytes.length < 2) {
      return { heartRate: 0 };
    }

    const flags = bytes[0];

    // Bit 0: Heart Rate Value Format
    // 0 = UINT8, 1 = UINT16
    const is16Bit = (flags & 0x01) === 1;

    // Bit 1-2: Sensor Contact Status
    const contactSupported = (flags & 0x04) !== 0;
    const contactDetected = contactSupported ? (flags & 0x02) !== 0 : undefined;

    // Bit 3: Energy Expended Status
    const hasEnergyExpended = (flags & 0x08) !== 0;

    // Bit 4: RR-Interval Status
    const hasRRInterval = (flags & 0x10) !== 0;

    let offset = 1;

    // Parse heart rate value
    let heartRate: number;
    if (is16Bit) {
      heartRate = (bytes[offset + 1] << 8) | bytes[offset];
      offset += 2;
    } else {
      heartRate = bytes[offset];
      offset += 1;
    }

    const reading: HeartRateReading = {
      heartRate,
      contactDetected,
    };

    // Parse Energy Expended if present
    if (hasEnergyExpended && bytes.length > offset + 1) {
      reading.energyExpended = (bytes[offset + 1] << 8) | bytes[offset];
      offset += 2;
    }

    // Parse RR-Intervals if present
    if (hasRRInterval && bytes.length > offset + 1) {
      const rrIntervals: number[] = [];
      while (offset + 1 < bytes.length) {
        // RR-Interval is in 1/1024 seconds resolution
        const rrInterval = ((bytes[offset + 1] << 8) | bytes[offset]) / 1024 * 1000;
        rrIntervals.push(Math.round(rrInterval));
        offset += 2;
      }
      reading.rrIntervals = rrIntervals;
    }

    return reading;
  }

  async disconnect(): Promise<void> {
    if (this.deviceId) {
      await this.bleManager.disconnect(this.deviceId);
      this.deviceId = null;
      this.onReadingCallback = null;
    }
  }

  isConnected(): boolean {
    return this.deviceId !== null && this.bleManager.isConnected(this.deviceId);
  }
}

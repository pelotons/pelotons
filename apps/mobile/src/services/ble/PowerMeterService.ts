import { BLEManagerService } from './BLEManager';
import { BLE_SERVICES, BLE_CHARACTERISTICS, PowerReading } from '@peloton/shared';

export class PowerMeterService {
  private bleManager: BLEManagerService;
  private deviceId: string | null = null;
  private onReadingCallback: ((reading: PowerReading) => void) | null = null;
  private lastCrankEvent: { revs: number; time: number } | null = null;

  constructor(bleManager: BLEManagerService) {
    this.bleManager = bleManager;
  }

  async connect(
    deviceId: string,
    onReading: (reading: PowerReading) => void
  ): Promise<void> {
    await this.bleManager.connect(deviceId);
    this.deviceId = deviceId;
    this.onReadingCallback = onReading;

    await this.bleManager.subscribeToCharacteristic(
      deviceId,
      BLE_SERVICES.CYCLING_POWER,
      BLE_CHARACTERISTICS.CYCLING_POWER_MEASUREMENT,
      (bytes) => {
        const reading = this.parsePowerMeasurement(bytes);
        if (this.onReadingCallback) {
          this.onReadingCallback(reading);
        }
      }
    );
  }

  private parsePowerMeasurement(bytes: number[]): PowerReading {
    if (bytes.length < 4) {
      return { instantPower: 0 };
    }

    // Bytes 0-1: Flags (16 bits)
    const flags = (bytes[1] << 8) | bytes[0];

    // Bytes 2-3: Instantaneous Power (sint16, Watts)
    // Handle signed 16-bit value
    let instantPower = (bytes[3] << 8) | bytes[2];
    if (instantPower > 32767) {
      instantPower -= 65536;
    }

    const reading: PowerReading = { instantPower: Math.max(0, instantPower) };

    // Parse optional fields based on flags
    let offset = 4;

    // Bit 0: Pedal Power Balance Present
    if (flags & 0x01) {
      if (bytes.length > offset) {
        reading.pedalPowerBalance = bytes[offset] / 2; // 0.5% resolution
        offset += 1;
      }
    }

    // Bit 2: Accumulated Torque Present
    if (flags & 0x04) {
      offset += 2; // Skip accumulated torque
    }

    // Bit 4: Wheel Revolution Data Present
    if (flags & 0x10) {
      offset += 6; // Skip wheel revolution data
    }

    // Bit 5: Crank Revolution Data Present
    if (flags & 0x20) {
      if (bytes.length >= offset + 4) {
        const crankRevs = (bytes[offset + 1] << 8) | bytes[offset];
        const crankTime = (bytes[offset + 3] << 8) | bytes[offset + 2];

        if (this.lastCrankEvent) {
          let revDiff = crankRevs - this.lastCrankEvent.revs;
          if (revDiff < 0) revDiff += 65536; // Handle rollover

          let timeDiff = crankTime - this.lastCrankEvent.time;
          if (timeDiff < 0) timeDiff += 65536; // Handle rollover

          if (timeDiff > 0 && revDiff > 0) {
            // Time is in 1/1024 seconds
            const cadence = (revDiff / (timeDiff / 1024)) * 60;
            reading.cadence = Math.round(cadence);
          }
        }

        this.lastCrankEvent = { revs: crankRevs, time: crankTime };
        offset += 4;
      }
    }

    return reading;
  }

  async disconnect(): Promise<void> {
    if (this.deviceId) {
      await this.bleManager.disconnect(this.deviceId);
      this.deviceId = null;
      this.onReadingCallback = null;
      this.lastCrankEvent = null;
    }
  }

  isConnected(): boolean {
    return this.deviceId !== null && this.bleManager.isConnected(this.deviceId);
  }
}

import { BleManager, Device, Characteristic, Subscription } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export class BLEManagerService {
  private manager: BleManager;
  private connectedDevices: Map<string, Device> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();

  constructor() {
    this.manager = new BleManager();
  }

  async requestPermissions(): Promise<boolean> {
    // Permissions are handled by Expo/React Native
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }

  async startScan(
    serviceUUIDs: string[],
    onDeviceFound: (device: Device) => void,
    durationMs: number = 10000
  ): Promise<void> {
    const state = await this.manager.state();
    if (state !== 'PoweredOn') {
      throw new Error('Bluetooth is not enabled');
    }

    return new Promise((resolve) => {
      this.manager.startDeviceScan(
        serviceUUIDs,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            return;
          }
          if (device && device.name) {
            onDeviceFound(device);
          }
        }
      );

      setTimeout(() => {
        this.stopScan();
        resolve();
      }, durationMs);
    });
  }

  stopScan(): void {
    this.manager.stopDeviceScan();
  }

  async connect(deviceId: string): Promise<Device> {
    const device = await this.manager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    this.connectedDevices.set(deviceId, device);

    // Monitor disconnection
    device.onDisconnected(() => {
      this.connectedDevices.delete(deviceId);
      this.subscriptions.get(deviceId)?.remove();
      this.subscriptions.delete(deviceId);
    });

    return device;
  }

  async disconnect(deviceId: string): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      this.subscriptions.get(deviceId)?.remove();
      this.subscriptions.delete(deviceId);
      await device.cancelConnection();
      this.connectedDevices.delete(deviceId);
    }
  }

  async disconnectAll(): Promise<void> {
    const deviceIds = Array.from(this.connectedDevices.keys());
    for (const deviceId of deviceIds) {
      await this.disconnect(deviceId);
    }
  }

  isConnected(deviceId: string): boolean {
    return this.connectedDevices.has(deviceId);
  }

  async subscribeToCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    onValue: (bytes: number[]) => void
  ): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error('Device not connected');
    }

    const subscription = device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Monitor error:', error);
          return;
        }
        if (characteristic?.value) {
          const bytes = Buffer.from(characteristic.value, 'base64');
          onValue(Array.from(bytes));
        }
      }
    );

    // Store subscription for cleanup
    const existingSubscription = this.subscriptions.get(deviceId);
    if (existingSubscription) {
      existingSubscription.remove();
    }
    this.subscriptions.set(deviceId, subscription);
  }

  async readCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<number[]> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error('Device not connected');
    }

    const characteristic = await device.readCharacteristicForService(
      serviceUUID,
      characteristicUUID
    );

    if (characteristic.value) {
      return Array.from(Buffer.from(characteristic.value, 'base64'));
    }

    return [];
  }

  getConnectedDevices(): Device[] {
    return Array.from(this.connectedDevices.values());
  }

  destroy(): void {
    this.disconnectAll();
    this.manager.destroy();
  }
}

// Singleton instance
export const bleManager = new BLEManagerService();

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { SCAN_SERVICE_UUIDS, BLE_SERVICES } from '@peloton/shared';

const bleManager = new BleManager();

interface DiscoveredDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  serviceUUIDs: string[] | null;
}

export function SensorPairingScreen() {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const startScan = async () => {
    // Clear previous devices
    setDevices([]);
    setScanning(true);

    // Check Bluetooth state
    const state = await bleManager.state();
    if (state !== 'PoweredOn') {
      Alert.alert('Bluetooth Required', 'Please enable Bluetooth to scan for sensors.');
      setScanning(false);
      return;
    }

    // Start scanning
    bleManager.startDeviceScan(
      [...SCAN_SERVICE_UUIDS] as string[],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          setScanning(false);
          return;
        }

        if (device && device.name) {
          setDevices((prev) => {
            // Check if device already exists
            if (prev.some((d) => d.id === device.id)) {
              return prev;
            }
            return [
              ...prev,
              {
                id: device.id,
                name: device.name,
                rssi: device.rssi,
                serviceUUIDs: device.serviceUUIDs,
              },
            ];
          });
        }
      }
    );

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const handleConnect = async (device: DiscoveredDevice) => {
    setConnecting(device.id);
    bleManager.stopDeviceScan();
    setScanning(false);

    try {
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // Get device type based on services
      const services = await connectedDevice.services();
      let sensorType = 'unknown';

      for (const service of services) {
        if (service.uuid.toLowerCase().includes('180d')) {
          sensorType = 'heart_rate';
          break;
        } else if (service.uuid.toLowerCase().includes('1818')) {
          sensorType = 'power';
          break;
        } else if (service.uuid.toLowerCase().includes('1816')) {
          sensorType = 'cadence';
          break;
        }
      }

      Alert.alert(
        'Connected!',
        `Successfully connected to ${device.name}.\nSensor type: ${sensorType}`,
        [{ text: 'OK' }]
      );

      // Disconnect for now (in real app, you'd save and keep connection)
      await connectedDevice.cancelConnection();
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', 'Unable to connect to the sensor. Please try again.');
    }

    setConnecting(null);
  };

  const getSensorTypeIcon = (serviceUUIDs: string[] | null): string => {
    if (!serviceUUIDs) return '📡';

    const uuidsLower = serviceUUIDs.map((u) => u.toLowerCase());
    if (uuidsLower.some((u) => u.includes('180d'))) return '❤️';
    if (uuidsLower.some((u) => u.includes('1818'))) return '⚡';
    if (uuidsLower.some((u) => u.includes('1816'))) return '🔄';
    return '📡';
  };

  const renderDevice = ({ item }: { item: DiscoveredDevice }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => handleConnect(item)}
      disabled={connecting !== null}
    >
      <View style={styles.deviceIcon}>
        <Text style={styles.deviceIconText}>{getSensorTypeIcon(item.serviceUUIDs)}</Text>
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceRssi}>
          Signal: {item.rssi ? `${item.rssi} dBm` : 'Unknown'}
        </Text>
      </View>
      {connecting === item.id ? (
        <ActivityIndicator color="#0066cc" />
      ) : (
        <Text style={styles.connectText}>Connect</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Make sure your sensor is in pairing mode and nearby.
        </Text>
        <TouchableOpacity
          style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
          onPress={startScan}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.scanButtonText}>Scanning...</Text>
            </>
          ) : (
            <Text style={styles.scanButtonText}>Scan for Sensors</Text>
          )}
        </TouchableOpacity>
      </View>

      {devices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {scanning ? 'Looking for sensors...' : 'No sensors found. Tap "Scan" to search.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    backgroundColor: '#2a2a2a',
  },
  headerText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  deviceCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconText: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceRssi: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  connectText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const mapboxToken = Constants.expoConfig?.extra?.mapboxToken;
MapboxGL.setAccessToken(mapboxToken || '');

export function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

  const handleCenterOnUser = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 15,
        animationDuration: 500,
      });
    }
  };

  const handleStartStop = () => {
    setIsRecording(!isRecording);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Outdoors}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            location
              ? [location.coords.longitude, location.coords.latitude]
              : [-0.1276, 51.5074]
          }
        />

        {location && (
          <MapboxGL.PointAnnotation
            id="user-location"
            coordinate={[location.coords.longitude, location.coords.latitude]}
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      {/* Controls overlay */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.centerButton} onPress={handleCenterOnUser}>
          <Text style={styles.centerButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.startStopButton,
            isRecording && styles.stopButton,
          ]}
          onPress={handleStartStop}
        >
          <Text style={styles.startStopText}>
            {isRecording ? 'STOP' : 'START'}
          </Text>
        </TouchableOpacity>

        {isRecording && (
          <TouchableOpacity style={styles.lapButton}>
            <Text style={styles.lapText}>LAP</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats bar when recording */}
      {isRecording && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0.0</Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>00:00</Text>
            <Text style={styles.statLabel}>time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0.0</Text>
            <Text style={styles.statLabel}>km/h</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 16,
    color: '#888',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 102, 204, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066cc',
    borderWidth: 2,
    borderColor: '#fff',
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
  centerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerButtonText: {
    fontSize: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  startStopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  startStopText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lapButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lapText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});

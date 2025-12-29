import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensors</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SensorPairing')}
        >
          <View style={styles.row}>
            <Text style={styles.label}>Pair New Sensor</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Units</Text>
            <Text style={styles.value}>Metric</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.label}>Keep Screen On</Text>
            <Text style={styles.value}>While Recording</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#888',
  },
  chevron: {
    fontSize: 20,
    color: '#888',
  },
  signOutButton: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
});

import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, StyleSheet, Animated, TextInput, ActivityIndicator } from 'react-native';
import { Input } from '@rneui/themed';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Layout } from '@/components/ui/Layout';

interface Device {
  label: string;
  value: string;
  wattage: string;
}

interface FrequencyOption {
  label: string;
  value: string;
}

interface DayOption {
  label: string;
  value: string;
}

interface Duration {
  hours: string;
  minutes: string;
}

interface DeviceEntry {
  id: string;
  device: string;
  duration: string;
  frequency: string;
  totalUsage: string;
}

export default function AddDevice() {
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [wattage, setWattage] = useState<string>('');
  const [frequencyType, setFrequencyType] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [duration, setDuration] = useState<Duration>({ hours: '0', minutes: '0' });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  // Create animation value
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add search functionality for devices
  const [searchQuery, setSearchQuery] = useState('');

  const deviceOptions: Device[] = [
    // Entertainment & Media
    { label: 'TV - LED/LCD/Plasma', value: 'tv', wattage: '100' },
    { label: 'Gaming Console', value: 'gaming_console', wattage: '150' },
    { label: 'Home Theater System', value: 'home_theater', wattage: '350' },
    { label: 'Streaming Device', value: 'streaming_device', wattage: '5' },

    // Kitchen Appliances
    { label: 'Refrigerator', value: 'refrigerator', wattage: '150' },
    { label: 'Microwave', value: 'microwave', wattage: '1200' },
    { label: 'Electric Stove', value: 'stove', wattage: '2000' },
    { label: 'Dishwasher', value: 'dishwasher', wattage: '1800' },
    { label: 'Coffee Maker', value: 'coffee_maker', wattage: '1000' },
    { label: 'Toaster/Toaster Oven', value: 'toaster', wattage: '1200' },
    { label: 'Blender', value: 'blender', wattage: '400' },
    { label: 'Food Processor', value: 'food_processor', wattage: '500' },

    // Climate Control
    { label: 'Air Conditioner', value: 'ac', wattage: '1500' },
    { label: 'Electric Fan', value: 'fan', wattage: '75' },
    { label: 'Space Heater', value: 'heater', wattage: '1500' },
    { label: 'Dehumidifier', value: 'dehumidifier', wattage: '600' },
    { label: 'Air Purifier', value: 'air_purifier', wattage: '50' },

    // Laundry & Cleaning
    { label: 'Washing Machine', value: 'washing_machine', wattage: '500' },
    { label: 'Clothes Dryer', value: 'dryer', wattage: '3000' },
    { label: 'Vacuum Cleaner', value: 'vacuum', wattage: '1400' },
    { label: 'Iron', value: 'iron', wattage: '1000' },

    // Computing & Office
    { label: 'Desktop Computer', value: 'desktop', wattage: '200' },
    { label: 'Laptop', value: 'laptop', wattage: '65' },
    { label: 'Monitor', value: 'monitor', wattage: '30' },
    { label: 'Printer', value: 'printer', wattage: '50' },
    { label: 'Router/Modem', value: 'router', wattage: '15' },

    // Lighting
    { label: 'LED Light', value: 'led_light', wattage: '10' },
    { label: 'CFL Light', value: 'cfl_light', wattage: '15' },
    { label: 'Incandescent Light', value: 'incandescent', wattage: '60' },
    { label: 'Smart Light', value: 'smart_light', wattage: '10' },

    // Personal Care
    { label: 'Hair Dryer', value: 'hair_dryer', wattage: '1800' },
    { label: 'Electric Shaver', value: 'shaver', wattage: '15' },
    { label: 'Electric Toothbrush', value: 'toothbrush', wattage: '5' },

    // Water & Heating
    { label: 'Water Heater', value: 'water_heater', wattage: '3000' },
    { label: 'Water Pump', value: 'water_pump', wattage: '750' },
    { label: 'Electric Kettle', value: 'kettle', wattage: '1500' },

    // Others
    { label: 'Security Camera', value: 'security_camera', wattage: '15' },
    { label: 'Doorbell', value: 'doorbell', wattage: '2' },
    { label: 'Electric Vehicle Charger', value: 'ev_charger', wattage: '7200' },
    { label: 'Smart Speaker', value: 'smart_speaker', wattage: '10' }
  ];

  // Add recently used devices
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Reset animation value before starting new animation
    slideAnim.setValue(0);
    
    const animation = Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });

    animation.start();

    // Cleanup function to reset animation when component unmounts
    return () => {
      animation.stop();
      slideAnim.setValue(0);
    };
  }, []);  // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    // Load recent devices from AsyncStorage
    const loadRecentDevices = async () => {
      const recent = await AsyncStorage.getItem('recentDevices');
      if (recent) {
        setRecentDevices(JSON.parse(recent));
      }
    };
    loadRecentDevices();
  }, []);

  const frequencyOptions: FrequencyOption[] = [
    { label: 'Everyday', value: 'everyday' },
    { label: 'Weekdays', value: 'weekdays' },
    { label: 'Weekends', value: 'weekends' },
    { label: 'Specific Days', value: 'specific' },
  ];

  const daysOfWeek: DayOption[] = [
    { label: 'Monday', value: 'MON' },
    { label: 'Tuesday', value: 'TUE' },
    { label: 'Wednesday', value: 'WED' },
    { label: 'Thursday', value: 'THU' },
    { label: 'Friday', value: 'FRI' },
    { label: 'Saturday', value: 'SAT' },
    { label: 'Sunday', value: 'SUN' },
  ];

  const handleDurationChange = (type: 'hours' | 'minutes', value: string) => {
    const numValue = parseInt(value) || 0;
    let newDuration = { ...duration, [type]: value };
    
    const totalMinutes = (parseInt(newDuration.hours) * 60) + parseInt(newDuration.minutes);
    if (totalMinutes > 1440) { // 24 hours = 1440 minutes
      newDuration = { hours: '24', minutes: '0' };
    }
    
    setDuration(newDuration);
  };

  const calculateTotalUsage = () => {
    const hours = parseInt(duration.hours) || 0;
    const minutes = parseInt(duration.minutes) || 0;
    const totalHours = hours + (minutes / 60);

    let frequencyMultiplier = 1;
    switch (frequencyType) {
      case 'everyday':
        frequencyMultiplier = 1;
        break;
      case 'weekdays':
        frequencyMultiplier = 5/7;
        break;
      case 'weekends':
        frequencyMultiplier = 2/7;
        break;
      case 'specific':
        frequencyMultiplier = selectedDays.length/7;
        break;
    }

    return (totalHours * frequencyMultiplier).toFixed(1);
  };

  const showNotificationWithType = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleAddDevice = async () => {
    setIsSubmitting(true);
    try {
      // Validate device selection
      if (!selectedDevice) {
        showNotificationWithType('Please select a device', 'error');
        return;
      }

      // Validate frequency selection
      if (!frequencyType) {
        showNotificationWithType('Please select frequency of use', 'error');
        return;
      }

      // Validate specific days selection if frequency is 'specific'
      if (frequencyType === 'specific' && selectedDays.length === 0) {
        showNotificationWithType('Please select at least one day', 'error');
        return;
      }

      // Validate duration
      const hours = parseInt(duration.hours) || 0;
      const minutes = parseInt(duration.minutes) || 0;
      
      if (hours === 0 && minutes === 0) {
        showNotificationWithType('Please enter a valid duration', 'error');
        return;
      }

      if (minutes >= 60) {
        showNotificationWithType('Minutes should be less than 60', 'error');
        return;
      }

      const selectedDeviceName = deviceOptions.find(d => d.value === selectedDevice)?.label || '';
      const totalUsage = calculateTotalUsage();

      const newDevice: DeviceEntry = {
        id: Date.now().toString(),
        device: selectedDeviceName,
        duration: `${duration.hours}.${duration.minutes}`,
        frequency: frequencyType,
        totalUsage: totalUsage
      };

      // Get existing devices
      const existingData = await AsyncStorage.getItem('deviceHistory');
      const devices: DeviceEntry[] = existingData ? JSON.parse(existingData) : [];
      
      // Add new device
      devices.push(newDevice);
      
      // Save updated list
      await AsyncStorage.setItem('deviceHistory', JSON.stringify(devices));
      
      // Update recent devices
      const updatedRecent = [
        deviceOptions.find(d => d.value === selectedDevice)!,
        ...recentDevices.filter(d => d.value !== selectedDevice)
      ].slice(0, 5);
      await AsyncStorage.setItem('recentDevices', JSON.stringify(updatedRecent));
      setRecentDevices(updatedRecent);

      // Show success feedback
      showNotificationWithType(`${selectedDeviceName} has been added successfully!`, 'success');

      // Reset form
      setSelectedDevice(null);
      setWattage('');
      setFrequencyType(null);
      setSelectedDays([]);
      setDuration({ hours: '0', minutes: '0' });
    } catch (error) {
      console.error('Error saving device:', error);
      showNotificationWithType('Error saving device. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Animated.ScrollView 
        className="flex-1 bg-gray-50"
        style={{
          opacity: slideAnim,
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
      >
        <View style={styles.wrapper}>
          <View style={styles.content}>
            {/* Updated Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>Add New Device</Text>
              <Text style={styles.headerSubtitle}>Track your device's energy consumption</Text>
            </View>

            {/* Recent Devices Section */}
            {recentDevices.length > 0 && (
              <View style={styles.recentDevices}>
                <Text style={styles.sectionTitle}>Recently Added</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recentDevices.map((device) => (
                    <TouchableOpacity
                      key={device.value}
                      style={styles.recentDeviceItem}
                      onPress={() => {
                        setSelectedDevice(device.value);
                        setWattage(device.wattage);
                      }}
                    >
                      <Text style={styles.recentDeviceText}>{device.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Updated Form Section */}
            <View style={styles.formContainer}>
              {/* Device Selection Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Device Type</Text>
                <Dropdown
                  style={[styles.dropdown]}
                  data={deviceOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedDevice}
                  onChange={(item: Device) => {
                    setSelectedDevice(item.value);
                    setWattage(item.wattage);
                  }}
                  placeholder="Select a device"
                />
              </View>

              {/* Wattage Display */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Wattage</Text>
                <Input
                  value={wattage}
                  onChangeText={setWattage}
                  keyboardType="numeric"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.inputInnerContainer}
                  style={styles.input}
                  placeholder="Enter wattage"
                />
              </View>

              {/* Frequency Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frequency of Use</Text>
                <Dropdown
                  style={[styles.dropdown]}
                  data={frequencyOptions}
                  labelField="label"
                  valueField="value"
                  value={frequencyType}
                  onChange={(item: FrequencyOption) => setFrequencyType(item.value)}
                  placeholder="Select frequency"
                />
              </View>

              {/* Specific Days Selection */}
              {frequencyType === 'specific' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Select Days</Text>
                  <View style={styles.daysContainer}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        onPress={() => {
                          setSelectedDays(prev => 
                            prev.includes(day.value)
                              ? prev.filter(d => d !== day.value)
                              : [...prev, day.value]
                          );
                        }}
                        style={[
                          styles.dayButton,
                          selectedDays.includes(day.value) && styles.dayButtonSelected
                        ]}
                      >
                        <Text style={[
                          styles.dayButtonText,
                          selectedDays.includes(day.value) && styles.dayButtonTextSelected
                        ]}>
                          {day.value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Duration Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration</Text>
                <View style={styles.durationContainer}>
                  <View style={styles.durationInput}>
                    <Input
                      placeholder="0"
                      label="Hours"
                      keyboardType="numeric"
                      value={duration.hours}
                      onChangeText={(value) => handleDurationChange('hours', value)}
                      containerStyle={styles.inputContainer}
                      inputContainerStyle={styles.inputInnerContainer}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.durationInput}>
                    <Input
                      placeholder="0"
                      label="Minutes"
                      keyboardType="numeric"
                      value={duration.minutes}
                      onChangeText={(value) => handleDurationChange('minutes', value)}
                      containerStyle={styles.inputContainer}
                      inputContainerStyle={styles.inputInnerContainer}
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              {/* Updated Submit Button */}
              <TouchableOpacity
                onPress={handleAddDevice}
                disabled={isSubmitting}
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Add Device</Text>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          transparent={true}
          visible={showNotification}
          animationType="fade"
          onRequestClose={() => setShowNotification(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowNotification(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalInner}>
                <MaterialCommunityIcons 
                  name={notificationType === 'success' ? "check-circle" : "alert-circle"}
                  size={50} 
                  color={notificationType === 'success' ? "#4CAF50" : "#DC2626"}
                />
                <Text style={styles.modalText}>
                  {notificationMessage}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    notificationType === 'success' ? styles.modalButtonSuccess : styles.modalButtonError
                  ]}
                  onPress={() => setShowNotification(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </Animated.ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  wrapper: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%'
  },
  content: {
    padding: 16,
    gap: 24
  },
  headerSection: {
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  headerSubtitle: {
    color: '#6b7280',
    marginTop: 4
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151'
  },
  dropdown: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainer: {
    paddingHorizontal: 0
  },
  inputInnerContainer: {
    borderBottomWidth: 0
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#e5e7eb'
  },
  dayButtonSelected: {
    backgroundColor: '#2563eb'
  },
  dayButtonText: {
    color: '#374151'
  },
  dayButtonTextSelected: {
    color: 'white'
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 16
  },
  durationInput: {
    flex: 1,
    marginBottom: -16
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalInner: {
    alignItems: 'center'
  },
  modalText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500'
  },
  modalButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  modalButtonSuccess: {
    backgroundColor: '#4CAF50'
  },
  modalButtonError: {
    backgroundColor: '#DC2626'
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  recentDevices: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  recentDeviceItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  recentDeviceText: {
    color: '#374151',
    fontWeight: '500',
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
});

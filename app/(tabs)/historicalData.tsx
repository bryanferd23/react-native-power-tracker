import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, ListItem } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { MaterialCommunityIcons as IconType } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Layout } from '@/components/ui/Layout';

interface DeviceEntry {
  id: string;
  device: string;
  duration: string;
  frequency: string;
  totalUsage: string;
}

export default function HistoricalData() {
  const [deviceData, setDeviceData] = useState<DeviceEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadDevices();
    }, [])
  );

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncStorage.getItem('deviceHistory');
      if (data) {
        const parsedData = JSON.parse(data);
        setDeviceData(parsedData);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadDevices().then(() => setRefreshing(false));
  }, []);

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'everyday': return 'calendar-sync';
      case 'weekdays': return 'calendar-week';
      case 'weekends': return 'calendar-weekend';
      case 'specific': return 'calendar-clock';
      default: return 'calendar';
    }
  };

  const onSwipeValueChange = async ({ key, value, direction }: { key: string; value: number; direction: string }) => {
    if (value < -80) {  // Threshold for deletion
      try {
        const updatedDevices = deviceData.filter(device => device.id !== key);
        await AsyncStorage.setItem('deviceHistory', JSON.stringify(updatedDevices));
        setDeviceData(updatedDevices);
      } catch (error) {
        console.error('Error deleting device:', error);
        Alert.alert('Error', 'Failed to delete device. Please try again.');
      }
    }
  };

  return (
    <Layout>
        <View style={styles.innerContainer}>
          {/* Summary Cards */}
          <Animated.View 
            entering={FadeIn.duration(500)}
            style={styles.summarySection}
          >
            <View style={styles.cardRow}>
              <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons 
                    name={"devices" as keyof typeof IconType.glyphMap} 
                    size={28} 
                    color="#4F46E5" 
                  />
                  <Text style={styles.cardNumber}>
                    {deviceData.length}
                  </Text>
                  <Text style={styles.cardLabel}>Total Devices</Text>
                </View>
              </Card>
              
              <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons 
                    name={"clock-outline" as keyof typeof IconType.glyphMap} 
                    size={28} 
                    color="#4F46E5" 
                  />
                  <Text style={styles.cardNumber}>
                    {deviceData.reduce((acc, curr) => acc + Number(curr.totalUsage), 0).toFixed(1)}h
                  </Text>
                  <Text style={styles.cardLabel}>Daily Usage</Text>
                </View>
              </Card>
            </View>
          </Animated.View>

          <SwipeListView
            data={deviceData}
            keyExtractor={(item) => item.id}
            onSwipeValueChange={onSwipeValueChange}
            rightOpenValue={-80}
            disableRightSwipe
            swipeToOpenPercent={30}
            renderItem={({ item }) => (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
              >
                <View style={styles.listItemContainer}>
                  <ListItem
                    containerStyle={styles.listItem}
                  >
                    <ListItem.Content>
                      <View style={styles.listItemContent}>
                        <View style={styles.listItemLeft}>
                          <ListItem.Title style={styles.deviceTitle}>
                            {item.device}
                          </ListItem.Title>
                          <View style={styles.frequencyContainer}>
                            <MaterialCommunityIcons 
                              name={getFrequencyIcon(item.frequency) as keyof typeof IconType.glyphMap} 
                              size={16} 
                              color="#6B7280" 
                            />
                            <Text style={styles.frequencyText}>
                              {item.frequency}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.listItemRight}>
                          <Text style={styles.usageText}>
                            {item.totalUsage}h
                          </Text>
                          <Text style={styles.perDayText}>
                            per day
                          </Text>
                        </View>
                      </View>
                    </ListItem.Content>
                  </ListItem>
                </View>
              </Animated.View>
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.hiddenItemContainer}>
                <View style={styles.hiddenItemInner}>
                  <View style={styles.deleteButton}>
                    <MaterialCommunityIcons 
                      name={"cellphone-off" as keyof typeof IconType.glyphMap} 
                      size={24} 
                      color="white" 
                    />
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#4F46E5"
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons 
                  name={"cellphone-off" as keyof typeof IconType.glyphMap} 
                  size={48} 
                  color="#9CA3AF" 
                />
                <Text style={styles.emptyTitle}>
                  No devices added yet
                </Text>
                <Text style={styles.emptySubtitle}>
                  Add devices to track their usage history
                </Text>
              </View>
            )}
          />
        </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  gradient: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%'
  },
  summarySection: {
    padding: 16
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: 'white',
    padding: 16
  },
  cardContent: {
    alignItems: 'center'
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#111827'
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  listItemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12
  },
  listItem: {
    borderRadius: 12,
    backgroundColor: 'transparent'
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItemLeft: {
    flex: 1
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  frequencyText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    textTransform: 'capitalize'
  },
  listItemRight: {
    alignItems: 'flex-end'
  },
  usageText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 18
  },
  perDayText: {
    fontSize: 14,
    color: '#6B7280'
  },
  hiddenItemContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8
  },
  hiddenItemInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64
  },
  emptyTitle: {
    color: '#6B7280',
    marginTop: 16,
    fontSize: 18
  },
  emptySubtitle: {
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    marginHorizontal: 32
  }
}); 
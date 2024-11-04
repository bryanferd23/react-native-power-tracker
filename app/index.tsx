import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from 'expo-blur';
import { router } from "expo-router";

export default function Layout() {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkFirstTime();
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        // router.replace('/(tabs)/addDevice');
      } else {
        await AsyncStorage.setItem('hasLaunched', 'true');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleGetStarted = () => {
    router.push('/(tabs)/addDevice');
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientOverlay} />
      <Animated.View 
        style={[
          styles.innerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <MaterialCommunityIcons
              name="lightning-bolt-circle"
              size={80}
              color="white"
            />
            <Text style={styles.title}>
              Smart Power Tracker
            </Text>
            <Text style={styles.subtitle}>
              Monitor and optimize your power consumption
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <View style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="plus" size={24} color="white" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Add Device</Text>
                <Text style={styles.featureSubtitle}>Connect your smart devices</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255, 255, 255, 0.6)" 
              />
            </View>

            <View style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="history" size={24} color="white" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Historical Data</Text>
                <Text style={styles.featureSubtitle}>View past consumption patterns</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="chart-line" size={24} color="white" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Power Insights</Text>
                <Text style={styles.featureSubtitle}>Analyze your energy usage</Text>
              </View>
            </View>
          </View>

          {/* Get Started Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={handleGetStarted}
            >
              <View style={styles.getStartedContent}>
                <Text style={styles.getStartedText}>Get Started</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#2563eb" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
  },
  innerContainer: {
    flex: 1,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 45,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    textAlign: 'center',
    maxWidth: '80%',
  },
  featuresSection: {
    marginBottom: 48,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  featureTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 18,
  },
  getStartedButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  getStartedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#1E40AF',
    fontWeight: '800',
    fontSize: 18,
    marginRight: 8,
  },
});


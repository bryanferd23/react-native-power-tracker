import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { MaterialCommunityIcons as IconType } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabBarItemProps {
  label: string;
  icon: keyof typeof IconType.glyphMap;
  isFocused: boolean;
  onPress: () => void;
}

const TabBarItem = ({ label, icon, isFocused, onPress }: TabBarItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isFocused ? 1 : 0.9),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={isFocused ? '#2563EB' : '#6B7280'}
        />
      </Animated.View>
      <Text style={[
        styles.label,
        { color: isFocused ? '#2563EB' : '#6B7280' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export function CustomTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
    }
  ];

  const TabBarContent = () => (
    <View style={styles.content}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = options.tabBarIcon?.({ 
          focused: isFocused, 
          color: '', 
          size: 24 
        });

        return (
          <TabBarItem
            key={route.key}
            label={String(label)}
            icon={(typeof icon === 'string' ? icon : 'help-circle') as keyof typeof IconType.glyphMap}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );

  return Platform.OS === 'ios' ? (
    <BlurView intensity={80} style={containerStyle}>
      <TabBarContent />
    </BlurView>
  ) : (
    <View style={[containerStyle, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
      <TabBarContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 
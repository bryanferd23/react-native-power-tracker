import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomTabBar } from '@/components/ui/TabBar';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="addDevice"
          options={{
            title: "Add Device",
            tabBarIcon: ({ focused }) => 
              focused ? "plus-circle" : "plus-circle-outline",
          }}
        />
        <Tabs.Screen
          name="historicalData"
          options={{
            title: "History",
            tabBarIcon: ({ focused }) => 
              focused ? "chart-timeline" : "chart-timeline-variant",
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ focused }) => 
              focused ? "lightbulb" : "lightbulb-outline",
          }}
        />
      </Tabs>
    </View>
  );
} 
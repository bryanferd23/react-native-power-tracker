import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Layout } from '@/components/ui/Layout';

interface InsightItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function Insights() {
  return (
    <Layout>
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Power Insights</Text>
              <Text style={styles.headerSubtitle}>Your energy usage analysis</Text>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Today's Usage</Text>
                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>-10%</Text>
                </View>
              </View>
              <Text style={styles.usageNumber}>4.2 kWh</Text>
              <Text style={styles.comparisonText}>vs. 4.7 kWh yesterday</Text>
            </View>

            {/* Insights Grid */}
            <View style={styles.insightsGrid}>
              <InsightItem
                icon="flash"
                title="High Usage Alert"
                description="TV consumption is above average"
                value="40%"
                trend="up"
              />
              
              <InsightItem
                icon="timer"
                title="Peak Hours"
                description="Most active devices"
                value="6PM-10PM"
              />
              
              <InsightItem
                icon="leaf"
                title="Eco Tip"
                description="Reduce TV usage by 1 hour to save"
                value="10%"
                trend="down"
              />
              
              <InsightItem
                icon="trending-up"
                title="Monthly Trend"
                description="Usage compared to last month"
                value="+15%"
                trend="up"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const InsightItem = ({ icon, title, description, value, trend }: InsightItemProps) => (
  <View style={styles.insightCard}>
    <View style={styles.insightContent}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#2563EB" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
      {value && (
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
          {trend && (
            <MaterialCommunityIcons 
              name={`trending-${trend}`} 
              size={20} 
              color={trend === 'up' ? '#EF4444' : trend === 'down' ? '#10B981' : '#6B7280'} 
            />
          )}
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%'
  },
  content: {
    padding: 16,
    gap: 24
  },
  headerContainer: {
    marginBottom: 8
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  percentageContainer: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999
  },
  percentageText: {
    color: '#15803d',
    fontWeight: '500'
  },
  usageNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827'
  },
  comparisonText: {
    color: '#6b7280',
    marginTop: 4
  },
  insightsGrid: {
    gap: 16
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconContainer: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 8
  },
  textContainer: {
    flex: 1
  },
  insightTitle: {
    color: '#1f2937',
    fontWeight: '600'
  },
  insightDescription: {
    color: '#6b7280',
    fontSize: 14
  },
  valueContainer: {
    alignItems: 'flex-end'
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  }
});
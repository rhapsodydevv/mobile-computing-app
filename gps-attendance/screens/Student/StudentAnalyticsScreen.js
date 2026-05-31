import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList
} from 'react-native';
import { UserStorage } from '../../components/UserStorage';
import { StudentMetrics } from '../../components/StudentMetrics';

export default function StudentAnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentAnalytics = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const user = await UserStorage.getUser();
      if (user && user.registrationNumber) {
        
        // Fix for registration formats containing slashes (e.g. BBIT/2026/1234)
        const encodedRegNum = encodeURIComponent(user.registrationNumber);
        
        const response = await fetch(
          `https://wibyyjdukskpqxktpllk.supabase.co/api/analytics/student?registrationNumber=${encodedRegNum}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const json = await response.json();
        if (json.status === 1) {
          setAnalyticsData(json.data);
        }
      }
    } catch (error) {
      console.error("Analytics synchronization fault:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudentAnalytics(false);
  };

  const renderUnitRow = ({ item }) => {
    // Aligned with the new 'attendanceRate' field
    const isUnitAtRisk = (item.attendanceRate || 0) < 75;
    return (
      <View style={styles.unitRowCard}>
        <View style={styles.unitLeftInfo}>
          <Text style={styles.unitCodeText}>{item.unitCode}</Text>
          <Text style={styles.unitSessionsCount}>
            {/* Aligned with 'sessionsAttended' and 'totalSessions' */}
            Attended {item.sessionsAttended || 0} of {item.totalSessions || 0} sessions
          </Text>
        </View>
        <View style={styles.unitRightPerformance}>
          <Text style={[styles.unitRatePercentage, isUnitAtRisk ? styles.textRisk : styles.textSafe]}>
            {(item.attendanceRate || 0).toFixed(1)}%
          </Text>
          <Text style={styles.subtextLabel}>Rate</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  // Derived calculations re-mapped to target 'unitBreakdowns' keys
  const totalSystemSessions = analyticsData?.unitBreakdowns?.reduce((acc, curr) => acc + (curr.totalSessions || 0), 0) || 0;
  const totalStudentAttended = analyticsData?.unitBreakdowns?.reduce((acc, curr) => acc + (curr.sessionsAttended || 0), 0) || 0;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* WRAP WITHIN FLATLIST AS HEADER TO RENDER UNIT BREAKDOWNS CLEANLY */}
      <FlatList
        data={analyticsData?.unitBreakdowns || []}
        keyExtractor={(item) => item.unitCode}
        renderItem={renderUnitRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4F46E5']} />
        }
        ListHeaderComponent={
          <View>
            {/* SCREEN TITLES */}
            <View style={styles.headerTitleBlock}>
              <Text style={styles.panelTitle}>Performance Index</Text>
              <Text style={styles.regNoSubtitle}>
                {analyticsData?.registrationNumber}
              </Text>
              
            </View>

            {/* INTEGRATED ANALYTICS PRESENTATION COMPONENT */}
            <StudentMetrics 
              cumulativeRate={analyticsData?.cumulativeAttendanceRate || 0}
              totalLectures={totalSystemSessions}
              attendedCount={totalStudentAttended}
              totalUnitsCount={analyticsData?.unitBreakdowns?.length || 0}
            />

            <Text style={styles.breakdownSectionTitle}>Course Unit Breakdown</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptySubText}>No active unit logs found to compile metrics report.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPadding: {
    paddingBottom: 32,
  },
  headerTitleBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 8,
  },
  badgeTop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  regNoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  breakdownSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  unitRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  unitLeftInfo: {
    flex: 1,
  },
  unitCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  unitSessionsCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 3,
  },
  unitRightPerformance: {
    alignItems: 'flex-end',
  },
  unitRatePercentage: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtextLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
  },
  textSafe: {
    color: '#15803D',
  },
  textRisk: {
    color: '#DC2626',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptySubText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
});
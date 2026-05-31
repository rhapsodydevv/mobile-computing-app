import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
import { UserStorage } from '../../components/UserStorage';

export default function AttendanceHistoryScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentReg, setStudentReg] = useState('');

  const fetchHistoryRecords = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const user = await UserStorage.getUser();
      if (user && user.registrationNumber) {
        setStudentReg(user.registrationNumber);
        
        // Safely sanitize and translate slash marks inside your registration numbers
        const encodedReg = encodeURIComponent(user.registrationNumber);
        
        const response = await fetch(
          `https://wibyyjdukskpqxktpllk.supabase.co/api/attendance-history?registrationNumber=${encodedReg}`,
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
          setLogs(json.data || []);
        }
      }
    } catch (error) {
      console.error("History pipeline syncing error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryRecords();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistoryRecords(false);
  };

  const formatIsoDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLogCard = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.logLeftSection}>
      
        <View style={{ flex: 1, paddingRight: 4 }}>
          <Text style={styles.unitNameText} numberOfLines={1}>
            {item.unitName || 'Class Session'}
          </Text>
          <Text style={styles.metaSubtitle}>
            {item.unitCode} • {item.classroomName}
          </Text>
          <Text style={styles.timestampLabel}>{formatIsoDate(item.markedAt)}</Text>
        </View>
      </View>

      <View style={styles.logRightSection}>
        <View style={[styles.pillBadge, item.isInsideGeofence ? styles.badgeSafe : styles.badgeRisk]}>
          <Text style={[styles.pillText, item.isInsideGeofence ? styles.textSafe : styles.textRisk]}>
            {item.isInsideGeofence ? 'Verified' : 'Flagged'}
          </Text>
        </View>
        <Text style={styles.distanceMetricText}>
          {item.distanceFromClassroom ? `${item.distanceFromClassroom.toFixed(1)}m away` : '0.0m'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View style={styles.headerBlock}>
        
        <Text style={styles.screenMainTitle}>Attendance Log</Text>
        <Text style={styles.studentRegText}>{studentReg || 'Fetching Account Registration...'}</Text>
      </View>

      {loading ? (
        <View style={styles.loaderCentering}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.attendanceId}
          renderItem={renderLogCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4F46E5']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyGraphic}>📂</Text>
              <Text style={styles.emptyTitle}>No Verification Traces</Text>
              <Text style={styles.emptySubtitle}>
                Your checked-in unit tracking records will automatically build down this sequence ledger.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  topBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  screenMainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  studentRegText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  loaderCentering: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainerStyle: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  logLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dotSafe: {
    backgroundColor: '#22C55E',
  },
  dotRisk: {
    backgroundColor: '#EF4444',
  },
  unitNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaSubtitle: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  timestampLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 4,
  },
  logRightSection: {
    alignItems: 'flex-end',
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSafe: {
    backgroundColor: '#DCFCE7',
  },
  badgeRisk: {
    backgroundColor: '#FEE2E2',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSafe: {
    color: '#15803D',
  },
  textRisk: {
    color: '#B91C1C',
  },
  distanceMetricText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyGraphic: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
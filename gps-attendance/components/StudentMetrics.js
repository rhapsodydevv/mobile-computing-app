import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function StudentMetrics({ cumulativeRate = 0, totalLectures = 0, attendedCount = 0, totalUnitsCount = 0 }) {
  const isBelowThreshold = cumulativeRate < 75;

  return (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Academic Analytics</Text>
      
      {/* HERO SCORE CARD */}
      <View style={styles.heroCard}>
        <View style={styles.rateRow}>
          <Text style={styles.bigPercentage}>{cumulativeRate.toFixed(1)}%</Text>
          <View style={[styles.statusBadge, isBelowThreshold ? styles.badgeRisk : styles.badgeSafe]}>
            <Text style={[styles.statusText, isBelowThreshold ? styles.textRisk : styles.textSafe]}>
              {isBelowThreshold ? '⚠️ At Risk' : '✨ Compliant'}
            </Text>
          </View>
        </View>
        <Text style={styles.cardLabel}>Overall Lecture Attendance Rate</Text>
        
        {/* PROGRESS BAR */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(cumulativeRate, 100)}%` }]} />
        </View>
      </View>

      {/* METRIC MINI GRID */}
      <View style={styles.gridRow}>
        <View style={styles.miniCard}>
          <Text style={styles.miniValue}>{attendedCount}</Text>
          <Text style={styles.miniLabel}>Present</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={[styles.miniValue, { color: '#EF4444' }]}>{totalLectures - attendedCount}</Text>
          <Text style={styles.miniLabel}>Absent</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={[styles.miniValue, { color: '#4F46E5' }]}>{totalUnitsCount}</Text>
          <Text style={styles.miniLabel}>Total Units</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsContainer: {
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bigPercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeSafe: {
    backgroundColor: '#DCFCE7',
  },
  badgeRisk: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSafe: {
    color: '#15803D',
  },
  textRisk: {
    color: '#B91C1C',
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 99,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  miniValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
  miniLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
});
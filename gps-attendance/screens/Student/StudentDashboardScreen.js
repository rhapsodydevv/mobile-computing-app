import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location"; 
import { UserStorage } from "../../components/UserStorage";

export default function StudentDashboardScreen({ navigation }) {
  // Active Sessions States
  const [activeSessions, setActiveSessions] = useState([]); 
  const [loadingSessions, setLoadingSessions] = useState(true);
  
  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  
  // Profile States
  const [firstName, setFirstName] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [email, setEmail] = useState(null);
  
  // GPS State Management
  const [locationPermission, setLocationPermission] = useState(null); 
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(null); 
  const [markedSessionIds, setMarkedSessionIds] = useState({}); 

  const initializeDashboard = async () => {
    try {
      setLoadingSessions(true);
      setLoadingAnalytics(true);

      // 1. Load Student Details from Local Storage
      const user = await UserStorage.getUser();
      if (user) {
        setFirstName(user.firstName);
        setEmail(user.email);
        setRegistrationNumber(user.registrationNumber);
      }

      // 2. Request Location Permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentCoords(loc.coords);
      }

      if (user && user.registrationNumber) {
        const encodedReg = encodeURIComponent(user.registrationNumber);
        
        // 3. Fetch Active Enrolled Class Sessions
        fetchActiveSessions(encodedReg, user.token);

        // 4. Fetch Analytics Metrics Payload
        fetchAnalyticsData(encodedReg, user.token);
      }
    } catch (error) {
      console.error("Initialization workflow broken:", error);
    } finally {
      setLoadingSessions(false);
      setLoadingAnalytics(false);
    }
  };

  const fetchActiveSessions = async (encodedReg, token) => {
    try {
      const response = await fetch(`https://wibyyjdukskpqxktpllk.supabase.co/api/class-sessions/active?registrationNumber=${encodedReg}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseText = await response.text();
      if (responseText && responseText.trim().length > 0) {
        const sessionJson = JSON.parse(responseText);
        if (sessionJson.status === 1 && Array.isArray(sessionJson.data)) {
          setActiveSessions(sessionJson.data);
          return;
        }
      }
      setActiveSessions([]);
    } catch (e) {
      console.error("Failed fetching live classes:", e);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchAnalyticsData = async (encodedReg, token) => {
    try {
      const response = await fetch(`https://wibyyjdukskpqxktpllk.supabase.co/api/analytics/student?registrationNumber=${encodedReg}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseText = await response.text();
      if (responseText && responseText.trim().length > 0) {
        const analyticsJson = JSON.parse(responseText);
        if (analyticsJson.status === 1) {
          setAnalyticsData(analyticsJson.data);
          return;
        }
      }
      setAnalyticsData(null);
    } catch (e) {
      console.error("Failed fetching student metrics context:", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    initializeDashboard();
  }, []);

  // Handle Attendance Validation Submission 
  const handleCheckIn = async (session) => {
    if (!currentCoords) {
      Alert.alert("Location Missing", "Locking onto precise GPS coordinates... please try again.");
      return;
    }

    const sessionId = session.classSessionId;

    try {
      setIsSubmittingAttendance(sessionId);
      const user = await UserStorage.getUser();

      const response = await fetch("https://wibyyjdukskpqxktpllk.supabase.co/api/attendances/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          classSessionId: sessionId,
          studentLatitude: currentCoords.latitude,
          studentLongitude: currentCoords.longitude,
          registrationNumber: user?.registrationNumber,
        }),
      });

      const result = await response.json();
      if (result.status === 1) {
        setMarkedSessionIds(prev => ({ ...prev, [sessionId]: true }));
        Alert.alert("Success", `Attendance verified for ${session.unitCode}!`);
        // Refresh analytics numbers following successful check-in
        if (user && user.registrationNumber) {
          fetchAnalyticsData(encodeURIComponent(user.registrationNumber), user.token);
        }
      } else {
        Alert.alert("Verification Failed", result.message || "Out of classroom radius.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not reach verification server.");
    } finally {
      setIsSubmittingAttendance(null);
    }
  };

  // Derive summary properties safely from analytics payload arrays
  const cumulativeRate = analyticsData?.cumulativeAttendanceRate || 0;
  const isBelowThreshold = cumulativeRate < 75;
  const totalLecturesCount = analyticsData?.unitBreakdowns?.reduce((acc, curr) => acc + (curr.totalSessions || 0), 0) || 0;
  const totalAttendedCount = analyticsData?.unitBreakdowns?.reduce((acc, curr) => acc + (curr.sessionsAttended || 0), 0) || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back, {firstName || "Student"}</Text>
            <Text style={styles.title}>{registrationNumber || email || "Loading account..."}</Text>
          </View>
        </View>

        {/* GPS HARDWARE ACCURACY BANNER */}
        <View style={styles.metaBannerContainer}>
          {locationPermission === false ? (
            <View style={[styles.statusBanner, styles.errorBanner]}>
              <Text style={styles.bannerText}>GPS Permissions Disabled. Tap settings to enable access.</Text>
            </View>
          ) : currentCoords ? (
            <View style={[styles.statusBanner, styles.successBanner]}>
              <Text style={styles.bannerTextSuccess}>✓ GPS Signal Active & Secured</Text>
            </View>
          ) : (
            <View style={[styles.statusBanner, styles.warningBanner]}>
              <ActivityIndicator size="small" color="#B45309" style={{ marginRight: 8 }} />
              <Text style={styles.bannerTextWarning}>Locking onto current coordinates...</Text>
            </View>
          )}
        </View>

        {/* NAVIGATION QUICK HUB */}
        <View style={styles.hubSection}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.hubGrid}>
            <TouchableOpacity style={styles.hubItem} onPress={() => navigation.navigate("My Units")}>
              <Text style={styles.hubIcon}>📚</Text>
              <Text style={styles.hubLabel}>My Units</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.hubItem} onPress={() => navigation.navigate("History")}>
              <Text style={styles.hubIcon}>🕒</Text>
              <Text style={styles.hubLabel}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.hubItem} onPress={() => navigation.navigate("Analytics")}>
              <Text style={styles.hubIcon}>📊</Text>
              <Text style={styles.hubLabel}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACTIVE ATTENDANCE RUNTIME SEGMENT */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Active Attendance Sessions</Text>
          
          {loadingSessions ? (
            <View style={[styles.emptyStateCard, { paddingVertical: 40 }]}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={[styles.noSessionSubText, { marginTop: 8 }]}>Scanning your enrolled timetable slots...</Text>
            </View>
          ) : activeSessions.length > 0 ? (
            activeSessions.map((session) => {
              const isMarked = markedSessionIds[session.classSessionId];
              const isProcessingThis = isSubmittingAttendance === session.classSessionId;

              return (
                <View key={session.classSessionId} style={styles.card}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.badgeText}>LIVE SESSION ACTIVE</Text>
                  </View>
                  
                  <Text style={styles.cardTitle}>{session.unitCode}</Text>
                  <Text style={styles.cardUnitName}>{session.unit?.unitName || "Enrolled Lecture Module"}</Text>
                  <Text style={styles.cardSubtitle}>Classroom: {session.classroomName}</Text>
                  
                  <View style={styles.divider} />

                  {isMarked ? (
                    <View style={styles.successBadgeBig}>
                      <Text style={styles.successBadgeText}>✓ Present & Verified</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.primaryButton, (!currentCoords || isSubmittingAttendance !== null) && styles.disabledButton]}
                      onPress={() => handleCheckIn(session)}
                      disabled={!currentCoords || isSubmittingAttendance !== null}
                    >
                      {isProcessingThis ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>Mark Attendance</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.noSession}>No active sessions tracking right now.</Text>
              <Text style={styles.noSessionSubText}>Sit tight. Once your lecturer spawns a session for your units, updates pull automatically.</Text>
            </View>
          )}
        </View>

        {/* NEW ANALYTICS REVIEW SECTION */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          
          {loadingAnalytics ? (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : analyticsData ? (
            <TouchableOpacity 
              style={styles.heroCard}
              onPress={() => navigation.navigate("Analytics")}
              activeOpacity={0.9}
            >
              <View style={styles.rateRow}>
                <View>
                  <Text style={styles.bigPercentage}>{cumulativeRate.toFixed(1)}%</Text>
                  <Text style={styles.cardLabel}>Cumulative Attendance</Text>
                </View>
                <View style={[styles.statusBadge, isBelowThreshold ? styles.badgeRisk : styles.badgeSafe]}>
                  <Text style={[styles.statusText, isBelowThreshold ? styles.textRisk : styles.textSafe]}>
                    {isBelowThreshold ? "AT RISK" : "GOOD"}
                  </Text>
                </View>
              </View>

              {/* Progress Bar Display */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(cumulativeRate, 100)}%`, backgroundColor: isBelowThreshold ? '#EF4444' : '#22C55E' }]} />
              </View>

              <View style={styles.gridRow}>
                <View style={styles.miniCard}>
                  <Text style={[styles.miniValue, { color: '#0F172A' }]}>{totalAttendedCount}</Text>
                  <Text style={styles.miniLabel}>Attended</Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={[styles.miniValue, { color: '#64748B' }]}>{totalLecturesCount}</Text>
                  <Text style={styles.miniLabel}>Total Held</Text>
                </View>
                <View style={styles.miniCard}>
                  <Text style={[styles.miniValue, { color: '#4F46E5' }]}>{analyticsData?.unitBreakdowns?.length || 0}</Text>
                  <Text style={styles.miniLabel}>Units tracked</Text>
                </View>
              </View>
              
              
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.noSession}>No metrics compiled yet.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 32 },
  header: {
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24,
    backgroundColor: "#FFFFFF", borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 2, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12
  },
  welcomeText: { fontSize: 13, fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: "700", color: "#0F172A", marginTop: 2 },
  metaBannerContainer: { paddingHorizontal: 24, marginTop: 16 },
  statusBanner: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, flexDirection: "row", alignItems: "center" },
  successBanner: { backgroundColor: "#DCFCE7" },
  warningBanner: { backgroundColor: "#FEF3C7" },
  errorBanner: { backgroundColor: "#FEE2E2" },
  bannerTextSuccess: { fontSize: 12, color: "#15803D", fontWeight: "600" },
  bannerTextWarning: { fontSize: 12, color: "#B45309", fontWeight: "600" },
  bannerText: { fontSize: 12, color: "#B91C1C", fontWeight: "600" },
  hubSection: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginBottom: 12 },
  hubGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  hubItem: { backgroundColor: "#FFFFFF", flex: 1, marginHorizontal: 4, borderRadius: 14, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  hubIcon: { fontSize: 22, marginBottom: 4 },
  hubLabel: { fontSize: 12, fontWeight: "600", color: "#334155" },
  contentSection: { paddingHorizontal: 24, marginTop: 24 },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: "#E2E8F0",
    elevation: 3, shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16
  },
  badgeContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0E7FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start", marginBottom: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4F46E5", marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#4F46E5" },
  cardTitle: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
  cardUnitName: { fontSize: 15, fontWeight: "600", color: "#334155", marginTop: 2 },
  cardSubtitle: { fontSize: 13, color: "#4F46E5", fontWeight: "600", marginTop: 6 },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 16 },
  primaryButton: { backgroundColor: "#4F46E5", borderRadius: 12, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  disabledButton: { backgroundColor: "#94A3B8" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  successBadgeBig: { backgroundColor: "#DCFCE7", borderRadius: 12, paddingVertical: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#BBF7D0" },
  successBadgeText: { color: "#16A34A", fontSize: 15, fontWeight: "700" },
  emptyStateCard: { backgroundColor: "#F1F5F9", borderRadius: 16, padding: 24, alignItems: "center", justifyContent: "center", borderStyle: "dashed", borderWidth: 1.5, borderColor: "#CBD5E1" },
  noSession: { fontSize: 15, fontWeight: "600", color: "#64748B", textAlign: "center" },
  noSessionSubText: { fontSize: 12, color: "#94A3B8", textAlign: "center", marginTop: 6, lineHeight: 18 },
  
  // Dashboard Analytics Hero Cards Layout
  heroCard: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 20,
    elevation: 2, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10
  },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigPercentage: { fontSize: 34, fontWeight: '800', color: '#0F172A', letterSpacing: -1 },
  cardLabel: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeSafe: { backgroundColor: '#DCFCE7' },
  badgeRisk: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '700' },
  textSafe: { color: '#15803D' },
  textRisk: { color: '#B91C1C' },
  progressBarBg: { height: 7, backgroundColor: '#E2E8F0', borderRadius: 99, marginTop: 14, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 99 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  miniCard: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, marginHorizontal: 3, alignItems: 'center' },
  miniValue: { fontSize: 16, fontWeight: '700' },
  miniLabel: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 1 },
  viewDetailedLink: { fontSize: 12, color: '#4F46E5', fontWeight: '600', marginTop: 14, textAlign: 'right' }
});
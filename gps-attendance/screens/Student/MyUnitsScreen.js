import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { UserStorage } from "../../components/UserStorage";

export default function MyUnitsScreen() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regNumber, setRegNumber] = useState('');

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user data from local storage
      const user = await UserStorage.getUser();
      if (!user || !user.registrationNumber) {
        throw new Error("User profile or registration number missing locally.");
      }
      setRegNumber(user.registrationNumber);

      // 2. URL Encode registration number to safely pass forward-slashes (/)
      const baseUrl = "https://mobile-computing-app-production.up.railway.app/api/units/my-units";
      const targetUrl = `${baseUrl}?registrationNumber=${encodeURIComponent(user.registrationNumber)}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      // 3. Update component state based on backend response status
      if (json.status === 1) {
        setUnits(json.data || []);
      } else {
        throw new Error(json.message || "Failed to retrieve units.");
      }
    } catch (err) {
      console.error("Units fetch error: ", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const renderUnitCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.codeContainer}>
            <Text style={styles.unitCode}>{item.unitCode}</Text>
          </View>
          <Text style={styles.semesterText}>
            Year {item.year} • Sem {item.semester}
          </Text>
        </View>

        <Text style={styles.unitName}>{item.unitName}</Text>
        
        {/* Safety wrapper matching the deep nested backend relations */}
        <Text style={styles.courseName}>
          {item.course?.courseName || item.courseCode || "General Module"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* 4. STRUCTURAL SCREEN TOP HEADER CONTAINER */}
      <View style={styles.headerBlock}>
       
        <Text style={styles.panelTitle}>Registered Units</Text>
        <Text style={styles.regNoSubtitle}>{regNumber || "Student Account"}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading your academic profile...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Connection Error</Text>
            <Text style={styles.errorSubText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUnits}>
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={units}
          keyExtractor={(item, index) => item.unitId || index.toString()}
          renderItem={renderUnitCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No registered units found</Text>
              <Text style={styles.emptySubText}>
                If you have completed your semester course registration, tap refresh below to sync.
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchUnits}>
                <Text style={styles.refreshButtonText}>Refresh Profile</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 4,
  },
  badgeTop: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4F46E5",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 6,
  },
  regNoSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  codeContainer: {
    backgroundColor: "#EEF2F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitCode: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: 0.5,
  },
  semesterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 24,
  },
  courseName: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
  errorSubText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  emptySubText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  refreshButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
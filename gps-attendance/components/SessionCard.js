import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SessionCard({ session, role, navigation }) {
  //Helper to safely format raw ISO strings into simple "HH:MM AM/PM" format
  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString; // fallback to original string if error
    }
  };

  // Safe data extraction based on your API structure
  const unitCode = session?.unitCode || session?.unit?.unitCode || "N/A";
  const unitName = session?.unit?.unitName || "";
  const roomName = session?.classroomName || session?.classroom?.roomName || "N/A";
  const startTime = formatTime(session?.startTime);
  const endTime = formatTime(session?.endTime);
  const displayStatus = session?.isActive ? "Active" : "Inactive";

  return (
    <View style={styles.card}>
      <Text style={styles.unit}>{unitCode} - {unitName}</Text>
      
      <Text style={styles.room}>Room: {roomName}</Text>
      <Text style={styles.time}>
        {startTime} - {endTime}
      </Text>

      <View style={styles.statusRow}>
        <Text style={[
          styles.status, 
          { color: session?.isActive ? "#4CAF50" : "#F44336" }
        ]}>
          {displayStatus}
        </Text>

        {role === "student" && session?.isActive && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MarkAttendance")}
          >
            <Text style={styles.buttonText}>Mark Attendance</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C2D35",
    padding: 30,
    borderRadius: 15,
    marginBottom: 10,
  },
  unit: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  unitName: {
    fontSize: 14,
    color: "#B0BEC5",
    marginTop: 2,
  },
  room: {
    color: "#598697",
    marginTop: 5,
  },
  time: {
    color: "#E8E9E9",
    marginTop: 5,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },
  status: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#598697",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ActionCard({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C2D35",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
  },
  title: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "../../../styles/theme";

export default function CourseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Course Details</Text>
      <Text style={styles.p}>Course ID from the route:</Text>
      <Text style={styles.code}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.screen, backgroundColor: theme.colors.bg },
  h1: { fontSize: 22, fontWeight: "800", color: theme.colors.text },
  p: { marginTop: 10, color: theme.colors.muted },
  code: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
});

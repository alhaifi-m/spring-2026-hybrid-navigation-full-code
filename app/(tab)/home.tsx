import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { theme } from "../../styles/theme";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Campus Hub</Text>
      <Text style={styles.p}>Quick overview for today</Text>

      <AppCard
        title="Upcoming Deadline"
        subtitle="CPRG-216 Assignment due Friday"
        right={
          <Ionicons
            name="alert-circle-outline"
            size={22}
            color={theme.colors.primary}
          />
        }
      />

      <AppCard
        title="Attendance"
        subtitle="You attended 3/4 classes this week"
        right={
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  h1: { fontSize: 28, fontWeight: "800", color: theme.colors.text },
  p: { marginTop: 6, marginBottom: 16, color: theme.colors.muted },
});

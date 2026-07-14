import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/AppCard";
import { theme } from "../../styles/theme";
import * as api from "../../lib/api";

export default function Home() {
  const [data, setData] = useState<api.DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setError(null);
      setIsLoading(true);
      const result = await api.getDashboard();
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if(error){
    return (
      <View style={styles.centered}>
        <Ionicons 
        name="cloud-offline-outline"
        size={48}
        color={theme.colors.muted}
        />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Campus Hub</Text>
      <Text style={styles.p}>{data?.greeting} Quick overview for today</Text>

      <AppCard
        title="Upcoming Deadline"
        subtitle={`${data?.nextDeadline.course} ${data?.nextDeadline.title} - due ${data?.nextDeadline.dueDate}`}
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
  centered: {
    flex:1,
    justifyContent: "center",
    alignItems:"center",
    backgroundColor:theme.colors.bg
  },
  errorText:{
    margin:12,
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center"
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.primary
  },
  retryText:{
    color:"#ffffff",
    fontSize:16,
    fontWeight: "700"
  }
});

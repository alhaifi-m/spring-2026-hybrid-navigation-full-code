import React from "react";
import { FlatList, StyleSheet, Text, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../../components/AppCard";
import { theme } from "../../../styles/theme";

const COURSES = [
  { id: "cprg216", title: "CPRG-216", subtitle: "Advanced Web Systems" },
  { id: "cprg303", title: "CPRG-303", subtitle: "Mobile Development" },
  { id: "cprg306", title: "CPRG-306", subtitle: "Backend APIs" },
];

export default function CoursesList() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Your Courses</Text>

      <FlatList
        data={COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(tab)/courses/${item.id}`)}>
            <AppCard
              title={item.title}
              subtitle={item.subtitle}
              right={
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.muted}
                />
              }
            />
          </Pressable>
        )}
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
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: theme.colors.text,
  },
});

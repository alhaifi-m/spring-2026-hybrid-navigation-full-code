import React, { useState, useEffect } from "react";
import { StyleSheet, Switch, Text, View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../../components/AppCard";
import { theme } from "../../../styles/theme";
import {router} from 'expo-router'
import * as storage from "@/lib/storage"

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true)

  // Load saved notification preference on mount

  useEffect(()=>{
    // Define an async function to load the value since useEffect can't be async 
    const loadNotifications = async () =>{
      // Try to load saved value from storage, if it exists
      const saved = await storage.get<boolean>(storage.STORAGE_KEYS.NOTIFICATIONS)
      if(saved !==null){
        // if we have a saved value, use it to set the sate
        setNotifications(saved)
      }
      setIsLoading(false)
    }
    // Call the async function to load notification 
    loadNotifications()
  },[])

  // save notification preference when toogled
  const handleToggle = async(value: boolean)=>{
    setNotifications(value)
    await storage.set(storage.STORAGE_KEYS.NOTIFICATIONS, value)
  }

  if(isLoading){
    // Show a loading indicator while we load the saved preference
    return(
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Settings</Text>

      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={
          <Switch value={notifications} onValueChange={handleToggle} />
        }
      />
      <Pressable onPress={()=> router.push("/(tab)/settings/profile")}>
        <AppCard
          title="Account"
          subtitle="Update profile settings"
          right={
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.primary}
            />
          }
        />
      </Pressable>
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

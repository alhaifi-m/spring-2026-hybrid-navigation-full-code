import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import {theme} from '../styles/theme'

export default function Index() {

  const { session, isLoading } = useAuth()

  if(isLoading){
    return(
      <View style={styles.centered}>

      </View>
    )
  }

  return <Redirect href={session ? "/(tab)/home" : "/login"} />;
}


const styles = StyleSheet.create({
  centered:{
    flex: 1,
     justifyContent: "center",
     alignItems:"center",
     backgroundColor: theme.colors.bg
  }
})
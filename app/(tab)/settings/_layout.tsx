import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";
export default function SettingsLayout(){
    return (
        <Stack>
            <Stack.Screen  name="index" options={{title:"Settings"}}/>
            <Stack.Screen name="profile" options={{title:"Profile"}}/>
        </Stack>
    )
}
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatScreen from "./ChatScreen";
import CallScreen from "./CallsScreen";
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import UdatesScreen from "./UpdatesScreen";
import CommunityScreen from "./CommunityScreen";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          
          if (route.name === "Chats"){
            return <MaterialIcons name="chat" size={size} color={color} />;
          }else if(route.name === "Updates"){
            return <FontAwesome6 name="signal-messenger" size={size} color={color} />;
          }else if(route.name === "Community"){
            return <FontAwesome name="group" size={size} color={color} />;
          }else if(route.name === "Calls"){
            return <Ionicons name="call" size={size} color={color} />;
          }
          
        },
        tabBarLabelStyle: { fontSize: 16, fontWeight: "800" },
        tabBarActiveTintColor: "#1447e6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          height: 77,
          backgroundColor: "#fff",
          paddingTop: 0,
        },
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen name="Updates" component={UdatesScreen} />
      <Tabs.Screen name="Community" component={CommunityScreen} />
      <Tabs.Screen name="Calls" component={CallScreen} />
      
    </Tabs.Navigator>
  );
}

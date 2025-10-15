import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { AuthContext, AuthProvider } from "./src/components/AuthProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { UserRegistrationProvider } from "./src/components/UserContext";
import { WebSocketProvider } from "./src/socket/WebSocketProvider";

import SplashScreen from "./src/screens/SplashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeTabs from "./src/screens/HomeTabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import SingleChatScreen from "./src/screens/SingleChatScreen";
import NewChatScreen from "./src/screens/NewChatSreen";
import NewContactScreen from "./src/screens/NewContactScreen";
import SignOutScreen from "./src/screens/SignOutScreen";

export type RootStack = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    chatName: string;
    lastSeenTime: string;
    profileImage: string;
  };
  NewChatScreen: undefined;
  NewContactScreen: undefined;
  SignOutScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function ChatApp() {
  const auth = useContext(AuthContext);

  
  if (auth?.isLoading) {
    return (
      
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{ headerShown: false, animation: "fade" }}
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    );
  }

  
  if (!auth?.userId) {
    return (
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SignUpScreen"
              screenOptions={{ headerShown: false, animation: "fade" }}
            >
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="ContactScreen" component={ContactScreen} />
              <Stack.Screen name="AvatarScreen" component={AvatarScreen} />
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    );
  }

  
  return (
    <WebSocketProvider userId={Number(auth.userId)}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="HomeScreen"
              screenOptions={{ headerShown: false, animation: "fade" }}
            >
              <Stack.Screen name="HomeScreen" component={HomeTabs} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown:true }}/>
              <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} options={{ headerShown:true }}/>
              <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown:true }}/>
              <Stack.Screen name="NewChatScreen" component={NewChatScreen} options={{ headerShown:true }}/>
              <Stack.Screen name="NewContactScreen" component={NewContactScreen} options={{ headerShown:true }}/>
              <Stack.Screen name="SignOutScreen" component={SignOutScreen} options={{ headerShown:true }}/>
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}

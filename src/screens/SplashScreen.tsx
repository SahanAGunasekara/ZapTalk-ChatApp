import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import "../../global.css";
import CircleShape from "../components/CircleShape";
import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { runOnJS } from "react-native-worklets";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWebSocketPing } from "../socket/useWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  //useWebSocketPing(1000*60*1);
  const navigation = useNavigation<Props>();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 3000 });
    // const timer = setTimeout(()=>{
    //     navigation.replace("SignUpScreen");
    // },3000);

    // return()=>{
    //     //clearInterval(timer);
    //     clearTimeout(timer);
    // };
  }, [navigation, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const { applied } = useTheme();

  const logo =
    applied === "dark"
      ? require("../../assets/logo1.png")
      : require("../../assets/logo.png");

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
      <StatusBar hidden={true} />
      <CircleShape
        width={200}
        height={200}
        borderRadius={999}
        className="bg-slate-900"
        topValue={-50}
        leftValue={-20}
      />
      <CircleShape
        width={200}
        height={200}
        borderRadius={999}
        className="bg-slate-900"
        topValue={-20}
        leftValue={90}
      />

      <Animated.View style={animatedStyle}>
        <Image source={logo} style={{ height: 180, width: 220 }} />
      </Animated.View>
      <Animated.View className="absolute bottom-20" style={animatedStyle}>
        <View className="justify-center items-center">
          <Text className="text-xs font-bold text-slate-600 dark:text-slate-200">
            POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text className="text-xs font-bold text-slate-600 dark:text-slate-200">
            VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

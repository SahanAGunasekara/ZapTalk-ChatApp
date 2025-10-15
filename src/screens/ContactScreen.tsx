import { StatusBar } from "expo-status-bar";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useContext, useState } from "react";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { checkAccount } from "../api/CheckAccount";
import { AuthContext } from "../components/AuthProvider";

//import "../../global.css";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK"); //default country code
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  const auth = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <StatusBar hidden={true} />
      <AlertNotificationRoot>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
        >
          <View className="p-5 items-center">
            <View>
              <Image
                source={require("../../assets/logo.png")}
                className="h-40 w-36"
              />
            </View>
            <View className="text-slate-600 font-bold">
              <Text>
                We use your contacts to help you fins friends who are already on
                the app. Your contact stay private.
              </Text>
            </View>
            <View className="mt-5 w-full">
              <View className="border-b-2 border-b-green-600 justify-center items-center flex-row h-14 mb-3">
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCountryNameButton
                  withCallingCode
                  visible={show}
                  onClose={() => {
                    setShow(false);
                  }}
                  onSelect={(c) => {
                    setCountryCode(c.cca2);
                    setCountry(c);
                    setShow(false);
                  }}
                />

                <AntDesign
                  name="caret-down"
                  size={24}
                  color="black"
                  style={{ marginTop: 5 }}
                />
              </View>

              <View className="mt-2 flex flex-row justify-center">
                <TextInput
                  inputMode="tel"
                  className="h-16 font-bold text-lg border-y-4 border-y-green-600 w-[18%] pe-1"
                  placeholder="+94"
                  editable={false}
                  value={country ? `+${country.callingCode}` : callingCode}
                  onChangeText={(text) => {
                    setCallingCode(text);
                  }}
                />
                <TextInput
                  inputMode="tel"
                  className="h-16 font-bold text-lg border-y-4 border-y-green-600 w-[80%] ml-2"
                  placeholder="77 #### ###"
                  value={phoneNo}
                  onChangeText={(text) => {
                    setPhoneNo(text);
                  }}
                />
              </View>
            </View>
            <View className="mt-20 w-full">
              <Pressable
                className="justify-center items-center bg-green-600 w-full h-14 rounded-full"
                onPress={async () => {
                  const validCountryCode = validateCountryCode(callingCode);
                  const validPhoneNo = validatePhoneNo(phoneNo);

                  if (validCountryCode) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validCountryCode,
                    });
                  } else if (validPhoneNo) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validPhoneNo,
                    });
                  } else {
                    setUserData((previous) => ({
                      ...previous,
                      countryCode: country
                        ? `+${country.callingCode}`
                        : callingCode,
                      contactNo: phoneNo,
                    }));

                    const response = await checkAccount(
                      userData.firstName,
                      userData.lastName,
                      callingCode,
                      phoneNo
                    );
                    const st = response.status;
                    console.log(st);
                    if (st) {
                      
                      const userId = response.uid;
                      console.log(userId);
                      if (auth) {
                        await auth.signUp(String(userId));
                      }
                    } else {
                      navigation.replace("AvatarScreen");
                    }
                  }
                }}
              >
                <Text className="text-xl font-bold text-slate-50">Next</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}

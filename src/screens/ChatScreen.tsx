import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen";
import NewChatScreen from "./NewChatSreen";

const Stack = createNativeStackNavigator();

export default function ChatScreen(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            
            
        </Stack.Navigator>
    );
}


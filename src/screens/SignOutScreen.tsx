import { useContext } from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../components/AuthProvider";

export default function SignOutScreen(){

const auth = useContext(AuthContext);

    return(
        <SafeAreaView>
            <Button
                title="Log Out"
                onPress={()=>{
                    if(auth) auth.signOut();
                }}
            />
        </SafeAreaView>
    );
}
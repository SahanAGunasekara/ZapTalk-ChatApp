import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    userId:string|null;
    isLoading:boolean;
    signUp:(id:string)=>Promise<void>;
    signOut:()=>Promise<void>;
};

export const AuthContext = createContext<AuthContextType|undefined>(undefined);
export const USER_ID_KEY = "userId";
export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [userId,setUserId]=useState<string|null>(null);
    const [isLoading,setLoading]=useState<boolean>(true);

    useEffect(()=>{
        (async()=>{
            try{
                const storeId = await AsyncStorage.getItem(USER_ID_KEY);
                setUserId(storeId);
            }catch(error){
                console.warn("Error restored userId", error);
                
            }finally{
                setTimeout(()=>{
                    setLoading(false);
                },4000);
                
            }
        })();
    },[]);

    const signUp = async (id:string)=>{
        await AsyncStorage.setItem(USER_ID_KEY,id);
        setUserId(id);
    };

    const signOut = async()=>{
        await AsyncStorage.removeItem(USER_ID_KEY);
        setUserId(null);
    };

    const value = useMemo(()=>({userId,isLoading,signUp,signOut}),[userId,isLoading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
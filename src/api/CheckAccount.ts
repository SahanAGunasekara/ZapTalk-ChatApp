import { UserRegistrationData } from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL+"/ChatApp";

export const checkAccount = async (firstName:string,lastName:string,countryCode:string,contactNo:string)=>{
    let formData = new FormData();

    formData.append("firstName",firstName);
    formData.append("lastName",lastName);
    formData.append("countryCode",countryCode);
    formData.append("contactNo",contactNo);

    const response = await fetch(API+"/AccountCheckController",{
        method:"POST",
        body:formData
    });

    if(response.ok){
        const json = await response.json();
        return json;
        // const userId  = json.uid;
        // console.log(userId);
    }else{
        return "Something went Wrong check your connection";
    }

};


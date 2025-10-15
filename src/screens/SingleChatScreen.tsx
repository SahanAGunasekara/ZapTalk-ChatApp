import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";

type Message = {
  id: number;
  text: string;
  sender: "me" | "friend";
  time: string;
  status?: "sent" | "delivered" | "read";
};

type singleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({
  route,
  navigation,
}: singleChatScreenProps) {
  const { chatId, chatName, lastSeenTime, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const [input, setInput] = useState("");

  const sendMessage = useSendChat();

  const [message, setMessage] = useState<Message[]>([
    { id: 1, text: "Hi", sender: "friend", time: "10.56 AM" },
    { id: 2, text: "Hi,Hello", sender: "friend", time: "10.57 AM" },
    {
      id: 3,
      text: "Hello, Kohomada?",
      sender: "me",
      time: "10.58 AM",
      status: "read",
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
            <Image source={{ uri:profileImage }}
            className="h-14 w-14 rounded-full"
            />
          </TouchableOpacity>
          <View className="space-y-2">
            <Text className="font-bold text-2xl">
              {friend ? friend.firstName + " " + friend.lastName : chatName}
            </Text>
            <Text className="italic text-xs font-bold text-gray-500">
              {friend?.status === "ONLINE"
                ? "Online"
                : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, friend]);

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;
    return (
      <View
        className={`my-1 mt-2 px-3 py-2 rounded-xl max-w-[75%] 
        ${
          isMe
            ? `self-end bg-sky-700 rounded-tl-xl rounded-bl-xl rounded-br-xl`
            : `rounded-tr-xl rounded-bl-xl rounded-br-xl self-start bg-gray-700
    `
        }`}
      >
        <Text className={`text-white text-base`}>{item.message}</Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text className={`text-white italic text-xs me-2`}>
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done-sharp"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={16}
              color={item.status === "READ" ? "#284c7" : "#9ca3af"}
            />
          )}
        </View>
      </View>
    );
  };

  // const sendMessage=()=>{
  //     if(input.trim()){
  //         const newMsg:Message={
  //             id:Date.now(),
  //             text:input,
  //             sender:"me",
  //             time:Date.now().toString(),
  //             status:"sent",
  //         };
  //         setMessage([newMsg,...message]);
  //         setInput("");
  //     }
  //     return !input.trim();
  // };

  const handleSendChat = () => {
    if (!input.trim) {
      return;
    }
    sendMessage(chatId, input);
    setInput("");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          className=" flex-1 px-3"
          inverted
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
        <View className="flex-row item-end p-2 bg-white">
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline
            placeholder="Type a message"
            className="flex-1 min-h-14 h-auto max-h-32 px-3 py-2 bg-gray-200 rounded-3xl text-base"
          />
          <TouchableOpacity
            className="bg-sky-700 w-14 h-14 items-center justify-center rounded-full"
            onPress={handleSendChat}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
